# Huffman Coding





## Section 1

### Decode Complexity

The decode method is the simpler of the two methods implemented by this module, with no complex recursive function calls like in the encode method. The method itself is composed of a for loop, iterating over each boolean in the data that's passed in, then performing a single function for each iteration. These functions are Branch.getLeft, Branch.getRight, and Leaf.getLabel, depending on the type of the Node that is being compared.

*The decode method as a whole*
```Java
public static String decode(Map<Character, List<Boolean>> code, List<Boolean> data) {
  Node root = treeFromCode(code);
  Node readHead = root;

  String tempOut = "";

  for (Boolean b : data) {
    if (readHead instanceof Branch) {
      if (b) {
        readHead = ((Branch) readHead).getRight();
      } else {
        readHead = ((Branch) readHead).getLeft();
      }
      if (readHead instanceof Leaf) {
        tempOut += ((Leaf) readHead).getLabel();
        readHead = root;
      }
    }
  }

  return tempOut;
}
```

*An example of the simple get methods*
```Java
public char getLabel() {
  return label;
}
```

In terms of time complexity, the for loop has O(n) complexity, as the scaling of the operation scales linearly with the size of the input (one iteration per boolean in the list). Additionally, each of the methods inside have O(1) complexity, as they are simple return functions for the private data stored in the object. This means that, overall, the function is O(n), as you take the dominant value in a given scope when calculating overall complexity. ^^(1)^^

### Encode Complexity

The encode method is the more complex of the two, implementing multiple methods that are more complex. These include Huffman.freqTable, Huffman.treeFromFreqTable, and Huffman.buildCode. freqTable has O(n) complexity, with a single for loop iterating over each character of the input. Similarly, treeFromFreqTable is O(n). As it has two loops iterating over the table that it's passed, the complexity scales to be double that of a standard loop, but the Big-O notation only describes the scaling of the complexity, rather than the factor involved.

The more complex method nested within Huffman.encode is Huffman.buildCode, calling Node.traverse, a recursive function that is implemented by both the Branch class and the Leaf class. The Branch version of this method is Ω(1), as it's possible for it to only have two Leaf objects attached to it. However, it's overall O(n), as it recurses over every instance of a Node in the tree. On top of this, Leaf's implementation is O(1), returning an individual hashmap entry.

Finally, the Huffman.encode method has a for loop that iterates over every character in the input, resulting in the method itself (outside of nested method calls) is O(n). Using the principle earlier that you only utilise the dominant value with Big-O complexity, this means that the encode method itself is O(n), as all of the methods are also O(n).

### Applications

This implementation is only useful for text, as the methods rely on Strings and Characters to be executed. This could be adapted to work on bytes by changing all instances of Character to Byte, and changing String to a Byte array or FileInputStream. This would allow for binary files to be encoded using this method, which may have a (slight) impact on the overall size of a file.

This module is currently very effective on large pieces of written text like novels, as it has a compression ratio of 30.84%, a reduction of 69.16%. This is a good amount reduction for the complexity of the module, exceeding the performance of Tar compression:

```zsh
> mvn test
  ...
  [Compressed input from 49652 bytes to 15315 bytes, 69.16% compression]
  Tests run: 8, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.586 sec
> l
  11K Jan 29 03:13 pg1459.tar.gz
  25K Jan  7 16:45 pg1459.txt
```

Tar compression has a reduction of 56%, whereas Huffman has a reduction of 69.16%. These implementations differ in execution, as Tarballs are designed for binary files, whereas Huffman is specifically for text. Additionally, Huffman coding's advantage becomes more prominent with a larger pool of data, as it produces a more optimal tree given a larger input when compared to Shannon-Fano coding. ^^2^^

Huffman coding is also lossless, making it a good fit for text and potentially some binary files, but a bad fit for audio, video and pictures. Although there are instances where this may be advantageous, these types of data are generally encoded with lossy formats, as the lost data is an acceptable tradeoff for smaller filesizes. Text encoding must be lossless, as lossy text encoding will result in unintelligible spelling and lost data, as text is very sensitive to information loss. ^^3^^

## Section 2

Overview:

Sorting algorithms
Stack/Queue/Priority Queue
LIFO, FIFO, LIFO, LILO
Radix Sort
Bubble Sort
Selection Sort
Insertion Sort
Trees
Binary Tree/Heap
Balanced and Self Balancing Trees
Recursion
Tail Recursion
Dijkstra's
Backtracking (Maze pathfinding)
N-Queens Problem - nonpromising nodes
Dynamic Programming
P=NP
Merge Sort
Quick Sort
Hash Tables
Hash Functions
Collision avoidance
 - Probing
 - Quadratic probing
 - Double hashing
Separate Chaining
Generating prime numbers
Implementing a hash function
Random Numbers
Encryption
Lossy Algorithms

^^ 1: https://hackernoon.com/big-o-for-beginners-622a64760e2 ^^
^^ 2: https://www.youtube.com/watch?v=B3y0RsVCyrw ^^
^^ 3: file:///home/lily/downloads/IJAIEM-2016-07-27-28.pdf ^^
