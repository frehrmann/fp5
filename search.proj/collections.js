/* A node in a list */
function Node(idx) {
  this.idx = idx;
  this.pre = undefined;
  this.next = undefined;
}

/* The list of things to search. */
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

  if(ptr === undefined) {
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

SearchList.prototype.remove = function(node) {

  if(this.root === undefined)
    return;

  let it = this.getIter();
  let elem = it.next();
  while(!elem.done) {
    let n = elem.value;

    if(n === node) {
      // rewire
      if(n.pre !== undefined)
        n.pre.next = n.next;
      if(n.next !== undefined)
        n.next.pre = n.pre;
      if(this.end === n)
        this.end = n.pre;
      if(this.root === n)
        this.root = n.next;
      n.pre = undefined;
      n.next = undefined;
      this.length -= 1;
      return;
    }

    elem = it.next();
  }
}

SearchList.prototype.getIter = function() {
  return new SearchListIterator(this);
}

function SearchListIterator(search_list) {
  this.ptr = search_list.root;
}

SearchListIterator.prototype.next = function() {
  if(this.ptr === undefined) {
    return {done: true, value: undefined};
  } else {
    let value = this.ptr;
    this.ptr = this.ptr.next;
    return {done: false, value: value};
  }
}

SearchList.prototype.NodeByIdx = function(idx) {

  let it = this.getIter();
  let elem = it.next();
  while(!elem.done) {
    if(elem.value.idx == idx)  break;
    elem = it.next();
  }
  if(elem.done)
    return undefined;
  else
    return elem.value;
}

function test_SearchList() {
  let sl = new SearchList();

  sl.push(15);
  sl.push(19);
  sl.push(22);
  sl.push(44);

  console.assert(sl.length == 4, "length should be 4, but is " + sl.length);

  let n = sl.NodeByIdx(22);
  sl.remove(n);

  sl.push(33);
  n = sl.NodeByIdx(44);
  sl.remove(n);

  it = sl.getIter();
  elem = it.next();
  let ar = [15, 19, 33];
  let i = 0;
  console.assert(ar.length == sl.length, "should be same length");
  while(!elem.done) {
    console.assert(ar[i] == elem.value.idx, "element " + i + " should be " + ar[i] + " but is " + elem.value.idx);
    elem = it.next();
    i++;
  }

  print("test SearchList passed");
}

