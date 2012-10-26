if(me) {
  this.creator = me.name;
  this.creatorId = me.id;
  emit('messages changed', this);
} else {
  cancel('you must be logged in to do that!');
}