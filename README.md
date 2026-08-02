# Learning With Ghosts – GERMANIA

**Learning With Ghosts – GERMANIA** is a modular TypeScript-based learning application exploring AI-mediated feedback loops, dual-layer frontend architecture, and system-driven UX.

It is both a real game and a real learning platform — built as a technical and product-focused portfolio project.

![](https://learning-with-ghosts-germania.vercel.app/ui/home_page/hero-image.png)

---

# Technical Overview

## Stack

- **TypeScript (frontend & backend)**
- **Next.js (App Router)**
- **React**
- **Phaser.js (rendering layer)**
- **Supabase (PostgreSQL)**
- **OpenAI SDK**

---

## Frontend Architecture

The application uses a **dual-layer rendering model** to clearly separate immersive rendering from structured UI logic.

### 1. Canvas Layer (Phaser.js)

- Scene-based architecture
- Sprite systems and mechanical logic
- Audio-driven immersion
- Isolated rendering responsibility

### 2. UI Layer (React + TypeScript)

- Structured lessons and exercises
- DOM-based interactions
- Typed state management
- Web Audio API for pronunciation feedback

### Layer Communication

- `mitt` for event-driven communication between Canvas and UI
- `zustand` for global lesson and progression state
- `howler.js` for sound control

This separation allows rendering complexity and learning logic to evolve independently while maintaining strict boundaries.

---

## Backend Architecture

- **Next.js API Routes**
- **Prisma ORM (typed data layer)**
- **Supabase (PostgreSQL)**
- **OpenAI SDK**

AI is responsible for:

- Validating user responses
- Mediating character interactions
- Suggesting review content
- Determining daily survival consequences

The backend acts as a decision engine rather than a simple persistence layer.

---

# Core Product Structure

Each in-game day is divided into two realities:

## The Real World – The Cell

![Josef's Cell](https://learning-with-ghosts-germania.vercel.app/screenshots/cell_01.png)
The player is evaluated under constrained conditions.  
![Josef's Cell](https://learning-with-ghosts-germania.vercel.app/screenshots/cell_02.png)
Performance directly affects in-game survival.

## The Dream World – The Cemetery

![Cemetery Phase](https://learning-with-ghosts-germania.vercel.app/screenshots/dream_01.png)
Josef enters a surreal cemetery as a ghost, where narrative dialogue introduces the dream world and reframes the "ghost" feeling as the beginning of his learning journey.

![Cemetery Phase 2](https://learning-with-ghosts-germania.vercel.app/screenshots/dream_02.png)
The Masked Nun guides Josef through a structured lesson, while interactive learning nodes connect vocabulary practice directly to the cemetery environment.

![Cemetery Phase 2](https://learning-with-ghosts-germania.vercel.app/screenshots/dream_03.png)
During pronunciation exercises, the player records each word and receives real-time visual feedback on vocal pitch and accuracy.

![Cemetery Phase 2](https://learning-with-ghosts-germania.vercel.app/screenshots/dream_04.png)
Writing exercises challenge the player to connect letters in the correct sequence, with limited hints and mistakes reinforcing each word mechanically.

![Cemetery Phase 2](https://learning-with-ghosts-germania.vercel.app/screenshots/dream_05.png)
Completing a lesson grows its learning node and unlocks new vocabulary, turning progression into visible changes within the dream world.

![Cemetery Phase 2](https://learning-with-ghosts-germania.vercel.app/screenshots/dream_06.png)
The listening phase combines spoken prompts, replay controls, character-based vocabulary nodes, and an in-game notebook for reviewing learned expressions.

Learning is reinforced mechanically rather than abstractly.

---

# Product Philosophy

Learning With Ghosts removes the guilt of playing when you should be studying —  
and removes the boredom of studying when you wish you were playing.

Learning is not an overlay.  
It is survival.

---

# Lore (Narrative Context)

## Alternate Timeline

In 1939, Adolf Hitler is assassinated.

A new regime rises — more strategic, more patient, more cynical.  
A false peace settles across Europe.

Germany becomes the uncontested center of power.  
Its new capital, **GERMANIA**, stands as a monument to dominance.

For years, foreign labor is used to build the city.  
Then policy shifts.

## The Native Language Law

A new law is enacted:

Adults who do not speak German become criminals.  
Teaching German to foreigners becomes a punishable offense.

Language becomes control.

## The Player

You are Josef G.

A foreign worker.  
A prisoner.  
A man trapped inside the city he helped construct.

Your only path to survival is learning.

---

# Game Architecture Reference

This document defines the core architectural concepts used in the game.  
The goal is to keep the system **clear, pragmatic, and maintainable**, without introducing unnecessary complexity.

This is not a rigid framework. It is a **reference for how the current system is intended to work** so that responsibilities remain clear as the project evolves.

---

# Core System Structure

## gameUI

Layer responsible for the **visual interface of the game outside the Phaser canvas**.

Characteristics:

- Implemented with **HTML + CSS + JS**
- Rendered **above the Canvas DOM**
- Contains elements such as:
  - dialogue boxes
  - prompts
  - UI overlays
  - interaction panels

Communication:

- Communicates with the Phaser game **exclusively through events**
- Does not directly manipulate scene or game objects

Purpose:

Separate UI rendering from the Phaser rendering pipeline, allowing more flexibility and simpler UI development.

---

## events

Messaging system used for **communication between game components**.

Primary uses:

- Communication between:
  - Phaser canvas layer
  - gameUI layer
- Cross-system signaling

Properties:

- Can be **synchronous or asynchronous**
- Events are **messages**, not logic containers

Examples of responsibilities:

- trigger UI prompts
- notify dialogue systems
- synchronize game and UI states

Important principle:

> Events communicate that something happened or should happen, but they do not contain gameplay rules.

---

## libs

Reusable support utilities that do not depend on game-specific components.

Characteristics:

- Infrastructure utilities
- Scene-compatible tools

Constraints:

- No dependency on game actors, flows, or states

Examples:

- reusable base classes
- small engine abstractions

Purpose:

Provide reusable functionality without introducing coupling with the game's domain logic.

---

## server

Server layer responsible for **providing content and configuration**.

Responsibilities:

- Inject lesson content
- Inject dialogue content
- Provide structured data used by the game

Future direction:

- Integration with a **CMS**

Important principle:

> The server provides **content and configuration**, not gameplay behavior.

---

## store

Central storage responsible for **shared and persistent state**.

Responsibilities:

- lesson data
- dialogue data
- scene progression
- player progression

Important distinction:

The store is intended for **shared or persistent state**, not transient gameplay state.

Examples of appropriate store data:

- which lesson is active
- dialogue sets for a given day
- progression state

Examples of things that should not live in the store:

- momentary input state
- temporary animation states
- short-lived scene transitions

---

# Core Gameplay Concepts

## Game Scene

The **largest execution unit of the game**.

A Game Scene represents a self-contained gameplay context.

Responsibilities:

- lifecycle management
- scene states
- camera
- player inputs
- audio
- actors
- environment
- orchestration of gameplay flows

The scene **contains and coordinates systems**, but it does not need to implement all logic directly.

Scenes act primarily as the **runtime context** where gameplay systems interact.

---

## Actor

An **entity within a scene** that has its own behavior.

An actor may contain:

- internal states
- animations
- audio
- behavior logic

Control rules:

Actors may be controlled by:

- the scene
- events

Actors **must not be controlled directly by other actors or arbitrary systems**.

This prevents tight coupling between gameplay entities.

Actors are responsible for managing their **own internal behavior and reactions**.

---

## State

A **contextual mode of operation** that defines what is currently allowed in the scene or actor.

States act as **context limiters**.

They define:

- what systems are active
- what interactions are allowed
- what behaviors are restricted

Examples:

- During an **introduction**, the player cannot interact with gameplay elements
- During **lesson explanation**, the player cannot move the character
- Pressing **ESC** may open a menu or exit dialogue depending on the state
- While **walking**, the actor uses the appropriate animation
- During **recovery**, the actor cannot receive damage

Properties:

- States have full access to the scene
- States configure what systems or interactions are enabled
- States do **not organize gameplay sequences**

States can exist in:

- scenes
- actors

Their primary role is to **define the operational context of the system**.

---

## Flow

Flows define the **ordered sequence of gameplay events**.

A flow represents a **progression of actions** that occur in a specific moment of the scene.

Structure:

A flow is composed of **steps**.

Each step may:

- configure part of the scene
- wait for player interaction
- wait for a time delay
- wait for an asynchronous operation

After completion, the flow proceeds to the next step.

Capabilities:

A flow may return:

- the next flow to execute
- the next state the scene should enter

Flows may also vary depending on:

- the phase of the scene
- the day of the game
- player progression

Properties:

- flows are **self-executing**
- flows contain **their own cleanup and destruction logic**

Recommended usage:

Flows can technically be triggered anywhere in the scene, but they are **most stable when executed within a scene state**.

---

# Relationship Between State and Flow

This distinction is central to the architecture.

**State defines the operational context.**

**Flow defines the sequence of events.**

Or more simply:

State → _what is allowed right now_  
Flow → _what happens in what order_

Example:

A scene may enter an `IntroductionState`.

Inside that state, a flow might:

1. show dialogue
2. zoom the camera
3. spawn a character
4. wait for input
5. transition to the next scene state

The **state defines the mode**, while the **flow executes the sequence**.

---

# Architectural Principles

This architecture follows several guiding principles:

### Keep systems loosely coupled

Actors should not control other actors directly.

Communication should happen through:

- scene orchestration
- events

---

### Separate context from progression

States define the **current context**.

Flows define the **ordered progression of actions**.

Maintaining this separation keeps gameplay logic easier to reason about.

---

### Avoid unnecessary complexity

The architecture intentionally avoids:

- deep inheritance hierarchies
- overly abstract frameworks
- premature system generalization

The goal is to support **rapid gameplay development** without sacrificing structural clarity.

---

### Prefer practical clarity over theoretical purity

This system is designed specifically for a **Phaser-based game architecture**.

Some centralization (especially in scenes) is expected and acceptable as long as responsibilities remain clear.

---

# Summary

The game architecture is built around the following conceptual layers:

| Layer     | Responsibility                        |
| --------- | ------------------------------------- |
| gameUI    | HTML interface layer above the canvas |
| events    | communication between systems         |
| libs      | reusable infrastructure utilities     |
| server    | lesson and dialogue content provider  |
| store     | shared and persistent game state      |
| GameScene | main runtime context                  |
| Actor     | gameplay entities with behavior       |
| State     | operational context of systems        |
| Flow      | ordered execution of gameplay events  |

This structure is intended to remain **flexible and pragmatic**, supporting ongoing iteration as the project evolves.

# Getting Started

Install dependencies:

```bash
npm install
npm run dev
```

## Spritesheet Generation

Spritesheets for animations are generated automatically from the raw frames exported from DragonBones.

### Source directory

Export the animation frames to the following directory structure:

```
asset-sources/dragonbones/actors/<actor>/<animation>/
```

Example:

```
asset-sources/dragonbones/actors/eliza/teaching/
```

Frames must follow this naming convention:

```
<actor>_<animation>_1.png
<actor>_<animation>_2.png
<actor>_<animation>_3.png
...
```

Example:

```
eliza_teaching_1.png
eliza_teaching_2.png
eliza_teaching_3.png
```

### Generate the spritesheet

Run the sprite build script:

```
yarn sprite -- <actor> <animation> [options]
```

Example:

```
yarn sprite -- eliza teaching --columns 6 --scale 0.8
```

This will:

1. Read the source frames from

```
asset-sources/dragonbones/actors/<actor>/<animation>
```

2. Generate the spritesheet and atlas in

```
public/actors/<actor>/<animation>/
```

Output files:

```
spritesheet.png
spritesheet.json
```

3. Automatically update the spritesheet registry in

```
src/constants/spritesheets.ts
```

### Available options

```
--columns <number>   Number of columns in the spritesheet
--scale <number>     Scale factor applied to each frame
--count <number>     Limit the number of frames used
--flip-x Apply horizontal flip (mirror) to all frames before assembling the spritesheet
```

### Example workflow

1. Export frames from DragonBones

```
asset-sources/dragonbones/actors/eliza/teaching/
```

2. Run the build command

```
yarn sprite -- eliza teaching --columns 6 --scale 0.8 --flip-x
```

3. The spritesheet and constants will be generated automatically.
