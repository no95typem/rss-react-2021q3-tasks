export function setFlyStyles(
  elem: HTMLElement,
  museElem: HTMLElement,
  state: boolean,
): void {
  if (state) {
    const style = window.getComputedStyle(museElem);
    elem.style.width = style.width;
    elem.style.height = style.height;
    elem.style.position = 'absolute';
    elem.style.zIndex = '1000';
  } else {
    elem.style.removeProperty('position');
    elem.style.removeProperty('z-index');
    elem.style.removeProperty('width');
    elem.style.removeProperty('height');
    elem.style.removeProperty('left');
    elem.style.removeProperty('top');
  }
}

export function moveElem(
  elem: HTMLElement,
  pageX: number,
  pageY: number,
): void {
  elem.style.left = `${pageX - elem.offsetWidth / 2}px`;
  elem.style.top = `${pageY - elem.offsetHeight / 2}px`;
}

export function setOnDragFalse(root: HTMLElement): void {
  root.ondragstart = () => {
    return false;
  };
  root.onmousemove = e => {
    e.preventDefault();
    return false;
  };
  root.onselectstart = e => {
    return false;
  };
  if (root.hasChildNodes()) {
    root.childNodes.forEach(child => setOnDragFalse(child as HTMLElement));
  }
}
