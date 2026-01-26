# Learning With Ghosts – GERMANIA

**Learning With Ghosts – GERMANIA** is a narrative-driven language learning game set in an alternate authoritarian Europe.

![](https://learning-with-ghosts-germania.vercel.app/ui/home_page/hero-image.png)

It is both a real game and a real learning platform.

It removes the guilt of playing when you should be studying — and removes the boredom of studying when you wish you were playing.

This project is built as a technical and creative portfolio piece, exploring the intersection of:

- Game design
- AI-mediated learning
- Narrative systems
- Modern web architecture
- Minimalist visual direction

---

## Is This a Game or a Learning Platform?

It is both.

Learning With Ghosts delivers:

- A structured language curriculum
- Reinforcement challenges
- Daily high-pressure evaluations
- Character progression

But it does so through:

- A fully built game world
- Mechanical consequences
- Audio-driven immersion
- Narrative stakes

Learning is not an overlay.  
It is survival.

---

## Core Experience

Each in-game day is divided into two realities:

### The Real World – The Cell

![Josef's Cell](https://learning-with-ghosts-germania.vercel.app/screenshots/cell.png)

You are **Josef G.**, an Armenian worker imprisoned in the capital city of GERMANIA — the same city you once helped build.

Each day ends with an interrogation.

Your German is tested.

If you fail, you do not eat.

The evaluator is **Frau Marlene Weiss**, an AI-controlled authority figure. Beautiful. Cold. Unforgiving.

---

### The Dream World – The Cemetery

![Josef's Cell](https://learning-with-ghosts-germania.vercel.app/screenshots/dream_01.png)

At night, Josef is visited by **Elisa**, a ghost determined to teach him everything he needs to survive.

Here the player:

- Learns new vocabulary
- Practices pronunciation
- Completes writing challenges
- Builds daily mastery

The dream world is where knowledge grows.
![Josef's Cell](https://learning-with-ghosts-germania.vercel.app/screenshots/dream_02.png)

---

### The Train Phase – Reinforcement Under Pressure

![Josef's Cell](https://learning-with-ghosts-germania.vercel.app/screenshots/train_01.png)

After learning, Josef and Elisa enter a symbolic train sequence.

- Pronunciation challenges fuel momentum
- Mistakes weaken progress
- Pressure builds

![Josef's Cell](https://learning-with-ghosts-germania.vercel.app/screenshots/train_02.png)
![Josef's Cell](https://learning-with-ghosts-germania.vercel.app/screenshots/train_03.png)
Learning is reinforced mechanically.

---

## Lore

### Alternate Timeline

In 1939, Adolf Hitler is assassinated.

A new regime rises — more strategic, more patient, more cynical.

A false peace settles across Europe.

Germany becomes the uncontested center of power.

Its new capital, **GERMANIA**, stands as a monument to dominance.

For years, foreign labor is used to build the city.

Then policy shifts.

---

### The Native Language Law

A new law is enacted:

Adults who do not speak German become criminals.

Teaching German to foreigners becomes a punishable offense.

Language becomes control.

---

### The Player

You are Josef G.

A foreign worker.  
A prisoner.  
A man trapped inside the city he helped construct.

Your only path to survival is learning.

---

## Technology

### Frontend Architecture

The game uses a **dual-layer rendering model**:

#### 1. Canvas Layer (Phaser.js)

- Immersive worlds rendered via Phaser
- Sprite systems, mechanics, audio cues
- Scene-based architecture

#### 2. UI Layer (HTML + CSS + TypeScript)

- Structured language lessons
- DOM-based exercises
- Web Audio API for pronunciation feedback

#### Layer Communication

- `mitt` for event-driven communication between Phaser and UI
- `zustand` for global lesson and progression state
- `howler.js` for immersive sound control

Built with:

- **Next.js**
- **TypeScript**
- Modular scene architecture

---

### Backend Architecture

- **Next.js API Routes**
- **Prisma ORM**
- **Supabase (PostgreSQL)**
- **OpenAI SDK**

AI is responsible for:

- Validating user responses
- Mediating character interactions
- Suggesting review content
- Determining daily survival consequences

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
