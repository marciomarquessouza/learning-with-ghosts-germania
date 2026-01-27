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
- **Prisma ORM**
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

![Josef's Cell](https://learning-with-ghosts-germania.vercel.app/screenshots/cell.png)

The player is evaluated under constrained conditions.  
Performance directly affects in-game survival.

## The Dream World – The Cemetery

![Cemetery Phase](https://learning-with-ghosts-germania.vercel.app/screenshots/dream_01.png)

New vocabulary is introduced and reinforced through structured challenges.

![Cemetery Phase 2](https://learning-with-ghosts-germania.vercel.app/screenshots/dream_02.png)

## The Train Phase – Reinforcement Under Pressure

![Train Phase](https://learning-with-ghosts-germania.vercel.app/screenshots/train_01.png)

- Pronunciation challenges fuel progression
- Mistakes weaken mechanical stability
- Pressure builds dynamically

![Train Phase 2](https://learning-with-ghosts-germania.vercel.app/screenshots/train_02.png)
![Train Phase 3](https://learning-with-ghosts-germania.vercel.app/screenshots/train_03.png)

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

# Getting Started

Install dependencies:

```bash
npm install
npm run dev
```
