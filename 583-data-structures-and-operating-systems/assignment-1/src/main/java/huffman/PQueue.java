package huffman;

import huffman.tree.Node;

import java.util.ArrayList;
import java.util.List;

/**
 * A priority queue of @Node@ objects. Each node has an int as its label
 * representing its frequency.
 * The queue should order objects in ascending order of frequency, i.e. lowest
 * first.
 */
public class PQueue {

  private List<Node> queue;

  public PQueue() {
    queue = new ArrayList<>();
  }

  /**
   * Add a node to the queue. The new node should be inserted at the point where
   * the frequency of next node is greater than or equal to that of the new one.
   *
   * @param n The node to enqueue.
   */
  public void enqueue(Node n) {

    // add to start if there are no other members
    if (queue.size() == 0) {
      queue.add(n);
      return;
    }

    // store this so we don't need to getFreq() in every iteration
    int nVal = n.getFreq();

    // iterate through each value in the queue and compare
    for (int i = 0; i < queue.size(); i++) {
      if (nVal <= queue.get(i).getFreq()) {
        // found the first object that's greater than or equal, add here
        queue.add(i, n);
        return;
      }
    }

    // got to the end, that makes this new value the largest - add to end
    queue.add(n);
  }

  /**
   * Remove a node from the queue.
   *
   * @return The first node in the queue.
   */
  public Node dequeue() {
    if (queue.size() > 0) {
      Node temp = queue.get(0);
      queue.remove(0);
      return temp;
    } else
      return null;
  }

  /**
   * Return the size of the queue.
   *
   * @return Size of the queue.
   */
  public int size() {
    return queue.size();
  }
}
