--- Q 1

PQueue (DONE)
- enqueue
  - add a node/leaf using it's value

https://study.com/academy/lesson/priority-queue-definition-methods.html
https://docs.oracle.com/javase/8/docs/api/java/util/List.html

tests all pass!

--- Q 2

freqTable
- Initialises a Map<Character, Integer> using the input string
  - The input string in the test is "Oh I do like to be beside the seaside, I do like to be beside the sea"

```markdown
| Location | Value |
| :------- | :---- |
| 'a'      | 5     |
|          |       |
| 'c'      | 10    |
|          |       |
|          |       |
| 'f'      | 23    |
|          |       |
| 'h'      | 5     |
|          |       |
```

Hashmap is ideal here as it allows each character to be specified with a value.
Count through each character and increment it's value in the hashmap using the character as a key.

https://docs.oracle.com/javase/8/docs/api/java/util/Map.html
https://docs.oracle.com/javase/8/docs/api/java/util/HashMap.html
https://stackoverflow.com/questions/2451650/how-do-i-apply-the-for-each-loop-to-every-character-in-a-string

tests all pass!

--- Q 3

Converts hashmap to frequency table using priority queue.

tests all pass!

--- Q 4

Traverse method
