if(me) {
  this.creator = me.name;
  emit('messages changed', this);
} else {
  cancel('you must be logged in to do that!');
}