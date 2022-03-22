#### Tutorial 1

Note: take breaks at regular intervals between tasks.

The assignment is to build a 3rd person game with genre of your choosing (e.g. action, puzzle, platformer, etc.). This tutorial will help you shape your ideas.

1. Read the assignment brief.
1. Note down important points and requirements. Do you know _precisely_ what you need to do?
1. Read the assignment brief again. Compare to your notes. Check if you missed anything.
1. Think about your game that you will develop. 
1. Background research (see what you can find online about existing games similar to what you want to do).
1. Create a Word (or alternative) document.
1. Add a page with a few sentences related to your game vision idea and how it might be implemented. No need for details yet, just think about what objects you will need in the game, e.g. player, coin, enemy, etc.
1. By the end of this tutorial, ensure you have at least a vague (ideally, solid) idea of what game you will build.

---

#### Tutorial 2-11

Link: [C++ Tutorials playlist](https://youtube.com/playlist?list=PL4h6ypqTi3RTsioTNjsLVgeEQ1HKR5H85)

Watch and complete the appropriate tutorial number that matches `week number - 1`, so Week 3 - tutorial 2, Week 4 - tutorial 3, etc.

---

#### Session 12 - C++ Recap Catch-up

Note: take breaks at regular intervals between tasks.

In this session, we will recap most C++ aspects we have covered and we will produce a few C++ games in the terminal.

1. Basics
1. Containers
1. Memory Management
1. Q & A + catch-up

Tasks:

1. Produce a terminal game called "guess the number":

The game picks a random number between 1 and 100. The user guesses the number from the terminal. The game responds: "higher", "lower" or "you won!".

1. Produce a terminal game called "Dungeon explorer":

The game generates a small dungeon (a 2d grid) and randomly populates the rooms with monsters or items. The user spawns in a random room and can type "N" for North, "S" for South, etc. to move around the dungeon.

Extension tasks:

1. If the user encounters an item, allow them to pick it up with "P".
1. If the user encounters a monster, allow them to fight it with "F".
1. Add an item class with `std::string` name.
1. Add an inventory class to keep track of items.
1. Allow the user to open inventory to see items with "I".
1. Add a combat system.
1. Add an RPG type class mechanism with types "Warrior", "Rogue" and "Mage", giving each type appropriate stats.

---

#### Session 17 - Make a Platformer in UE4

Note: take breaks at regular intervals between tasks.

In this session, we will use everything we have covered so far to make a platformer. The game will have:

1. Collectable coins that increase the player score.
1. Player score is shown on the screen.
1. Moving platforms with variable height.
1. Portals that can be activated by moving on special platforms.
1. A treasure object that completes the level.
1. A simple puzzle that opens a passage to the treasure.

Extension tasks:

1. Add a mini-game like [Tower of Hanoi](https://www.youtube.com/watch?v=nCdKCDSMUeA)
1. Add a countdown timer that ends the game if the player didn't get to the treasure quickly.
1. Add audio from the starter content to various interactions in the level.

---

#### Session 18 - UE4 and C++

Note: take breaks at regular intervals between tasks.

In this session, we will re-implement our early UE4 examples using C++. Start with [UE4 C++ quick start](https://docs.unrealengine.com/en-US/Programming/QuickStart/index.html).

1. Extend the code base by rotating "roll" and "pitch", which are the same as "yaw" rotations but along different axes.
1. Add Scale animation (similar to change in rotation, but now the change happens in scale XYZ).
1. Add Translate animation (similar to change in rotation, but now the change happens in location XYZ).

Extension tasks:

1. Re-implement the animation as a change of value (e.g. translate, rotate, or scale) but as a ratio of progress `[0..1]`. For example, at progress 0, the scale could be `1,1,1` and at progress 1, the scale is `3,3,3`.
1. Then, using delta time update progress from 0 to 1.
1. Finally, use one of these [interpolators](https://github.com/AlmasB/FXGL/blob/master/fxgl-animation/src/main/kotlin/com/almasb/fxgl/animation/Interpolators.kt) to control the rate of change of the progress, resulting in a non-linear animation.
