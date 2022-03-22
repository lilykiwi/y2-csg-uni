package huffman;

import huffman.tree.Branch;
import huffman.tree.Leaf;
import huffman.tree.Node;

import java.util.*;

/**
 * The class implementing the Huffman coding algorithm.
 */
public class Huffman {

  /**
   * Build the frequency table containing the unique characters from the String
   * `input' and the number of times
   * that character occurs.
   *
   * @param input The string.
   * @return The frequency table.
   */
  public static Map<Character, Integer> freqTable(String input) {

    // return null if input is null
    if (input == null || input.isEmpty()) {
      return null;
    }

    // initialise the table
    Map<Character, Integer> ft = new HashMap<>();

    // scan over every character in the input
    for (char ch : input.toCharArray()) {
      if (ft.get(ch) == null) {
        // not found, add it to the hashmap with a value of 1
        ft.put(ch, 1);
      } else {
        // already exists, so add 1
        ft.replace(ch, ft.get(ch) + 1);
      }
    }

    // return the completed table
    return ft;
  }

  /**
   * Given a frequency table, construct a Huffman tree.
   *
   * First, create an empty priority queue.
   *
   * Then make every entry in the frequency table into a leaf node and add it to
   * the queue.
   *
   * Then, take the first two nodes from the queue and combine them in a branch
   * node that is
   * labelled by the combined frequency of the nodes and put it back in the queue.
   * The right hand
   * child of the new branch node should be the node with the larger frequency of
   * the two.
   *
   * Do this repeatedly until there is a single node in the queue, which is the
   * Huffman tree.
   *
   * @param freqTable The frequency table.
   * @return A Huffman tree.
   */
  public static Node treeFromFreqTable(Map<Character, Integer> freqTable) {

    // create new empty queue
    PQueue q = new PQueue();

    if (freqTable == null || freqTable.size() == 0) {
      // frequency table is empty or malformed
      return null;
    }

    // iterate over every key in the Iterable Set from keySet()
    for (Character key : freqTable.keySet()) {
      // get the value from the key
      int keyVal = freqTable.get(key);

      // enqueue a new leaf using the value and key
      q.enqueue(new Leaf(key, keyVal));
    }

    // we now have a properly ordered list of key,value pairs in Leaf form.

    Node left = null;
    Node right = null;

    while (q.size() > 1) {
      // pop the last 2 values and merge them into a branch
      left = q.dequeue();
      right = q.dequeue();

      // add them into a branch
      q.enqueue(new Branch(left.getFreq() + right.getFreq(), left, right));
    }

    // queue is only one branch now

    return q.dequeue();

  }

  /**
   * Construct the map of characters and codes from a tree. Just call the traverse
   * method of the tree passing in an empty list, then return the populated code
   * map.
   *
   * @param tree The Huffman tree.
   * @return The populated map, where each key is a character, c, that maps to a
   *         list of booleans
   *         representing the path through the tree from the root to the leaf node
   *         labelled c.
   */
  public static Map<Character, List<Boolean>> buildCode(Node tree) {
    return tree.traverse(new ArrayList<>());
  }

  /**
   * Create the huffman coding for an input string by calling the various methods
   * written above. I.e.
   *
   * + create the frequency table,
   * + use that to create the Huffman tree,
   * + extract the code map of characters and their codes from the tree.
   *
   * Then to encode the input data, loop through the input looking each character
   * in the map and add
   * the code for that character to a list representing the data.
   *
   * @param input The data to encode.
   * @return The Huffman coding.
   */
  public static HuffmanCoding encode(String input) {
    // create the code points based on the input using above methods
    Map<Character, Integer> table = freqTable(input);
    Node tree = treeFromFreqTable(table);
    Map<Character, List<Boolean>> code = buildCode(tree);

    // populate the array using a lookup derived from the char in the string
    ArrayList<Boolean> data = new ArrayList<>();
    for (int i = 0; i < input.length(); i++) {
      data.addAll(code.get(input.charAt(i)));
    }

    // return both values (code and data array)
    return new HuffmanCoding(code, data);
  }

  /**
   * Reconstruct a Huffman tree from the map of characters and their codes. Only
   * the structure of this tree
   * is required and frequency labels of all nodes can be set to zero.
   */
  public static Node treeFromCode(Map<Character, List<Boolean>> code) {
    Branch base = new Branch(0, null, null);
    Set<Character> chars = code.keySet();

    for (char c : chars) {

      Node current = base;

      Iterator<Boolean> bs = code.get(c).iterator();

      while (bs.hasNext()) {
        Boolean b = bs.next();
        if (b) {
          if (!bs.hasNext()) {
            // there isn't anything next, so set a leaf on the right
            ((Branch) current).setRight(new Leaf(c, 0));
          } else if (((Branch) current).getRight() == null) {
            // there's something next and nothing to the right, so create a branch
            ((Branch) current).setRight(new Branch(0, null, null));
          }
          current = ((Branch) current).getRight();
        } else {
          if (!bs.hasNext()) {
            // there isn't anything next, so set a leaf on the right
            ((Branch) current).setLeft(new Leaf(c, 0));
          } else if (((Branch) current).getLeft() == null) {
            // there's something next and nothing to the right, so create a branch
            ((Branch) current).setLeft(new Branch(0, null, null));
          }
          current = ((Branch) current).getLeft();
        }
      }
    }

    return base;
  }

  /**
   * Decode some data using a map of characters and their codes. To do this you
   * need to reconstruct the tree from the
   * code using the method you wrote to do this. Then take one boolean at a time
   * from the data and use it to traverse
   * the tree by going left for false, right for true. Every time you reach a leaf
   * you have decoded a single
   * character (the label of the leaf). Add it to the result and return to the
   * root of the tree. Keep going in this
   * way until you reach the end of the data.
   *
   * @param code The code.
   * @param data The encoded data.
   * @return The decoded string.
   */
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
}
