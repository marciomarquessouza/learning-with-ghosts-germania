import { SelectableArea, SelectableAreaConfig } from "./SelectableArea";

export class SelectableAreasController {
  private scene!: Phaser.Scene;
  private areas = new Map<string, SelectableArea>();

  create(scene: Phaser.Scene) {
    this.scene = scene;
  }

  addArea(areaId: string, config: SelectableAreaConfig) {
    const area = new SelectableArea(this.scene, config);
    this.areas.set(areaId, area);
  }

  get(id: string) {
    return this.areas.get(id);
  }

  setAllDisabled(disabled: boolean) {
    this.areas.forEach((area) => area.setDisabled(disabled));
  }

  setAllDebugVisible(visible: boolean) {
    this.areas.forEach((area) => area.setDebugVisible(visible));
  }

  destroy(id: string) {
    const area = this.areas.get(id);
    if (!area) return;

    area.destroy();
    this.areas.delete(id);
  }

  destroyAll() {
    this.areas.forEach((area) => area.destroy());
    this.areas.clear();
  }
}
