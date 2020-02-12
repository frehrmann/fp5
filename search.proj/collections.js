/* A node in a list */
function Node(idx) {
  this.idx = idx;
  this.pre = undefined;
  this.next = undefined;
}

function SearchList() {
  this.root = undefined;
  this.end = undefined;
  this.length = 0;
}

SearchList.prototype.push = function(idx) {
  let n = new Node(idx);
  if(this.root === undefined) {
    this.root = n;
    this.end = n;
  } else {
    this.end.next = n;
    n.pre = this.end;
    this.end = n;
  }
  this.length += 1;
}

SearchList.prototype.popFirst = function() {
  let ptr = this.root;

  if(this.root === undefined) {
    this.end = undefined;
  } else {
    this.root = ptr.next;
    this.length -= 1;
  }

  // pointer should be unconnected
  ptr.next = undefined;
  ptr.pre = undefined;

  return ptr;
}

SearchList[Symbol.iterator] = function(){
  return {
    ptr: this.root,

     next : function () {
       if(ptr === undefined) {
         return {done: true, value: undefined};
       } else {
         let value = ptr;
         ptr = ptr.next;
         return {done: false, value: value};
       }
     }
  }
}
