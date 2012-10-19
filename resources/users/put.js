var visited = new Date(this.visited);
var now = new Date().getTime();

if(now - visited < 5000) {
    emit('visit', me.name);
}