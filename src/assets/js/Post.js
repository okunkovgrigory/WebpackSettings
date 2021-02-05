export default class Post{
    constructor(title){
        this.title = title;
        this.date = Date()
    }

    toString(){
        return JSON.stringify({
            title: this.title,
            date: this.date
        }, null, 2)
    }
}