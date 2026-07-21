import argparse
import math
import json
import re
from pathlib import Path
from PIL import Image


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate a spritesheet and JSON atlas from a set of PNG frames."
    )
    parser.add_argument(
        "basename",
        type=str,
        help="Base name of the image files (e.g. 'eliza_idle' for eliza_idle_1.png)",
    )
    parser.add_argument(
        "--input-dir",
        type=str,
        required=True,
        help="Directory containing the source PNG frames.",
    )
    parser.add_argument(
        "--output-dir",
        type=str,
        required=True,
        help="Directory where the spritesheet PNG and JSON atlas will be generated.",
    )
    parser.add_argument(
        "--columns",
        type=int,
        default=3,
        help="Number of columns in the spritesheet (default: 3).",
    )
    parser.add_argument(
        "--count",
        type=int,
        help="Number of images to include (optional).",
    )
    parser.add_argument(
        "--scale",
        type=float,
        default=1.0,
        help="Scale factor for frames (e.g. 0.8). Default: 1.0",
    )
    parser.add_argument(
        "--flip-x",
        action="store_true",
        help="Apply horizontal flip (mirror) to all frames before assembling the spritesheet.",
    )
    return parser.parse_args()


def validate_args(args: argparse.Namespace) -> None:
    if args.scale <= 0:
        raise ValueError("--scale must be > 0")

    if args.columns <= 0:
        raise ValueError("--columns must be > 0")

    if args.count is not None and args.count <= 0:
        raise ValueError("--count must be > 0 when provided")


def load_and_scale(path: Path, scale_factor: float, flip_x: bool = False) -> Image.Image:
    img = Image.open(path).convert("RGBA")

    if scale_factor != 1.0:
        new_w = max(1, int(round(img.width * scale_factor)))
        new_h = max(1, int(round(img.height * scale_factor)))
        img = img.resize((new_w, new_h), Image.LANCZOS)

    if flip_x:
        img = img.transpose(Image.FLIP_LEFT_RIGHT)

    return img


def find_matching_files(input_dir: Path, basename: str) -> list[Path]:
    image_pattern = re.compile(rf"{re.escape(basename)}_(\d+)\.png$")

    matching_files = []
    for file_path in input_dir.iterdir():
        if not file_path.is_file():
            continue

        match = image_pattern.fullmatch(file_path.name)
        if match:
            matching_files.append((int(match.group(1)), file_path))

    matching_files.sort(key=lambda item: item[0])
    return [file_path for _, file_path in matching_files]


def ensure_same_frame_size(frames: list[Image.Image]) -> tuple[int, int]:
    frame_width, frame_height = frames[0].size

    for i, frame in enumerate(frames[1:], start=1):
        if frame.size != (frame_width, frame_height):
            raise ValueError(
                "Frame size mismatch after scaling. "
                f"Frame 0 is {frame_width}x{frame_height}, "
                f"frame {i} is {frame.size[0]}x{frame.size[1]}. "
                "Ensure all source images are the same size before scaling."
            )

    return frame_width, frame_height


def main() -> None:
    args = parse_args()
    validate_args(args)

    input_dir = Path(args.input_dir).resolve()
    output_dir = Path(args.output_dir).resolve()

    if not input_dir.exists():
        raise FileNotFoundError(f"Input directory does not exist: {input_dir}")

    if not input_dir.is_dir():
        raise NotADirectoryError(f"Input path is not a directory: {input_dir}")

    output_dir.mkdir(parents=True, exist_ok=True)

    matching_files = find_matching_files(input_dir, args.basename)

    if args.count is not None:
        frame_paths = matching_files[: args.count]
    else:
        frame_paths = matching_files

    if not frame_paths:
        raise FileNotFoundError(
            f"No images found in '{input_dir}' matching pattern: {args.basename}_<number>.png"
        )

    frames = [load_and_scale(path, args.scale, args.flip_x) for path in frame_paths]
    frame_count = len(frames)

    frame_width, frame_height = ensure_same_frame_size(frames)

    rows = math.ceil(frame_count / args.columns)
    sheet_width = frame_width * args.columns
    sheet_height = frame_height * rows

    sheet_filename = "spritesheet.png"
    json_filename = "spritesheet.json"

    sheet_path = output_dir / sheet_filename
    json_path = output_dir / json_filename

    sheet = Image.new("RGBA", (sheet_width, sheet_height))

    data = {
        "frames": {},
        "meta": {
            "image": sheet_filename,
            "size": {"w": sheet_width, "h": sheet_height},
            "scale": str(args.scale),
        },
    }

    for index, frame in enumerate(frames):
        col = index % args.columns
        row = index // args.columns
        x = col * frame_width
        y = row * frame_height

        sheet.paste(frame, (x, y))

        frame_id = f"{args.basename}_{index}"
        data["frames"][frame_id] = {
            "frame": {"x": x, "y": y, "w": frame_width, "h": frame_height},
            "rotated": False,
            "trimmed": False,
            "spriteSourceSize": {
                "x": 0,
                "y": 0,
                "w": frame_width,
                "h": frame_height,
            },
            "sourceSize": {"w": frame_width, "h": frame_height},
        }
        data["meta"]["flip_x"] = args.flip_x

    sheet.save(sheet_path)

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

    print(
        f"✅ Generated {sheet_path} and {json_path} with {frame_count} frame(s) "
        f"in {args.columns}x{rows} layout. "
        f"Frame size: {frame_width}x{frame_height}. Scale: {args.scale}"
    )


if __name__ == "__main__":
    main()