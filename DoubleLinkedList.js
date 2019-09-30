/**
 * Initial Node
 * @return object
 */
var Node = function() {
  this.data = 0
  this.prev = null,
  this.next = null
}

/**
 * Initial Double Linked List
 * @return object
 */
var DoubleLinkedList = function() {
  // This is head and tail initialization
  this.head = null
  this.tail = null

  // Add New Node
  this.addNode = function(data) {
    newNode = new Node
    newNode.data = data

    if (this.head == null) {
      this.head = this.tail = newNode
      this.head.prev = null
      this.tail.next = null
    }
    else {
      this.tail.next = newNode
      newNode.prev = this.tail
      this.tail = newNode
      this.tail.next = null
    }
  }

  // Traverse The Linked
  this.display = function() {
    current = this.head
    if (this.head == null) {
      console.log("List is empty")
      return
    }
    else {
      while(current != null) {
        console.log(current.data)
        current = current.next
      }
    }
  }
}

// Example to use it
var list = new DoubleLinkedList()
list.addNode(10)
list.addNode(20)
list.display()
