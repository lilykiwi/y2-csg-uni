
---

## Binary Trees

```
    0
   / \
  0   1
 /|   |\
0 1   0 1
```

000, 001, 010, 011

first bit does nothing?

```
   /\
  0  1
 /|  |\
0 1  0 1
```

00, 01, 10, 11

same amount of data

---

## Frequency analysis

Read the file byte by byte, creating an array of characters and their frequency. Using an object with properities char(primitive) and uint64? sort the array by 2nd property and then run through the characters in order.

Analysis needed for how huffman trees encode characters, but having a frequency dictionary is half the battle.

---

## Objects

Node
  has frequency value
  has children nodes mapped to 0 and 1

NodeCharacter
  has frequency value
  has no children nodes
  has char primitive

---

## Encoding the tree

Take two Nodes or NodeCharacters from the end of the array/stack, and combine them into a Node if the right-hand value is greater than the left-hand value. If it is, temporarily pop the right-hand value and compare again with the two to the left of it.

The new node will have the sum of the frequency of the two nodes it contains.

For example, for array A,27 B,15 C,7 D,6 E,6 F,5:

```plaintext
                ______ cmp: 5<6 so join
A27 B15 C7  D6  E6  F5

            ________ cmp: 11>6 so cmp next two
A27 B15 C7  D6    11
                 /  \
                E    F

        _____ cmp: 6<7 so join
A27 B15 C7 D6   11
               /  \
              E    F

          _________ cmp: 11<13 so join
A27 B15   13     11
         /  \   /  \
        C    D E    F

    ___________ cmp: 24>15 so cmp next two
A27 B15      24
            /   \
          13     11
         /  \   /  \
        C    D E    F

_______ 15<27 so join
A27 B15      24
            /   \
          13     11
         /  \   /  \
        C    D E    F

    ___________ cmp: last two nodes so join
    42       24
   /  \     /   \
  A    B  13     11
         /  \   /  \
        C    D E    F

```


---

## Serialisation

To output the code to a file you need to serialise the tree somehow.

https://www.geeksforgeeks.org/serialize-deserialize-binary-tree/

https://stackoverflow.com/questions/2675756/efficient-array-storage-for-binary-tree/

seems like the most efficient way is to push/pop based on child status

Serialising the tree is pointless as the tree generation is deterministic: simply store the frequency of each character and rebuild the tree using the same code. The tree will be generated the same based on the same input, so storing the tree as a serialised object (and decoding it) is potentially less space-efficient.

---

## Format

the header for the file will contain the frequency of each letter, stored as a char (2 bytes), followed by a long (8 bytes) for the frequency. This means a maximum header size of 1.25KiB (128*8) + (128*2) for ASCII.

The header could contain the number of bits contained in the frequency value, i.e.

```
 A       5       15
|______||______||___|
010000010000010110101
```

This allows for smaller headers as it cuts out extraneous data: the majority of the data in a header with 8 byte integers will be 0's.
