export default class Log {
  static println(context: string): void {

    //console.log(context)

    let p = document.createElement('p')

    p.className = 'debug'
    p.innerText = context
    document.getElementById('status').appendChild(p)
  }
}

