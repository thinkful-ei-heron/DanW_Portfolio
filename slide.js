class Slider {
  constructor(container, leftBtn, rightBtn) {
    this.container = container;
    this.leftBtn = leftBtn;
    this.rightBtn = rightBtn;
    this.children = [];
    this.current = 0;
    this.transitionTime;
    this.init();
  }

  init() {
    //console.dir(this);
    this.leftBtn.onclick = () => {
      this.slideLeft();
    };
    this.leftBtn.addEventListener('keyup', e => {
      if (e.keyCode === 13) this.slideLeft();
    });
    this.rightBtn.onclick = () => {
      //console.log('right clicked');
      this.slideRight();
    };
    this.rightBtn.addEventListener('keyup', e => {
      if (e.keyCode === 13) this.slideRight();
    });

    //this.children = this.container.children;
    //console.dir(this.container.children);

    for (let i = 0; i < this.container.children.length; i++) {
      if (this.container.children[i].nodeName === 'IMG') {
        this.children.push(this.container.children[i]);
        if (i === 0) {
          let id = this.children[this.current].id;
          this.highlight(id);
        }
      }
    }
  }

  slideLeft() {
    if (this.current === 0) {
      return; //console.log('first');
    } else {
      this.children[this.current].classList.toggle('hideLeft');
      this.children[this.current - 1].classList.toggle('hideRight');

      let id = this.children[this.current].id;
      this.highlight(id);
      //console.log('TCL: Slider -> slideLeft -> id', id);

      this.current--;
      id = this.children[this.current].id;
      this.highlight(id);
    }
  }

  slideRight() {
    if (this.current === this.children.length - 1) {
      return; //console.log('last');
      //this.children[0].classList.toggle('hideRight');
      //this.children
    } else {
      this.children[this.current].classList.toggle('hideRight');
      this.children[this.current + 1].classList.toggle('hideLeft');

      let id = this.children[this.current].id;
      this.highlight(id);
      this.current++;
      id = this.children[this.current].id;
      this.highlight(id);
    }
  }

  highlight(id) {
    //console.log(`#${id}Txt`);
    //console.dir(document.querySelector(`#${id}Txt`));
    document.querySelector(`#${id}Txt`).classList.toggle('highlight');
  }
}

function init() {
  let container = document.querySelector('.slider');
  let leftBtn = document.querySelector('.leftButton');
  //console.log('TCL: init -> leftBtn', leftBtn);
  let rightBtn = document.querySelector('.rightButton');
  let slide = new Slider(container, leftBtn, rightBtn);
}

init();
