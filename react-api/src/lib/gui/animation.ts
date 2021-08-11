import { OBJ_PROCESSOR } from '../processors/obj-processor';

export interface TransitionPromiseInterface {
  elem: HTMLElement;
  prop: string;
  val?: string;
  valToWait?: string;
  forceAutoresolveIn?: number;
}

export function extractTimeInMS(input: string | number | undefined): number {
  if (typeof input === 'number') return input;

  if (typeof input === 'undefined') return 0;

  const isMS = input.match(/ms/gi);
  const time = Number.parseFloat(input);

  if (Number.isNaN(time)) return 0;

  if (!isMS) return time * 1000;

  return time;
}

export function getTransitionDuration(
  style: CSSStyleDeclaration,
  prop: string,
): string | undefined {
  const transPropArr = style
    .getPropertyValue('transition-property')
    .replace(',', '')
    .split(' ');
  let propIndex = transPropArr.lastIndexOf(prop);

  if (propIndex === -1) propIndex = transPropArr.lastIndexOf('all');

  if (propIndex !== -1) {
    const transDurationsArr = style
      .getPropertyValue('transition-duration')
      .replace(',', '')
      .split(' ');
    return transDurationsArr[propIndex];
  }

  return undefined;
}

export function transitionPromise(
  params: TransitionPromiseInterface,
): Promise<boolean> {
  return new Promise(resolve => {
    const transformAndAutoresolve = (delay?: number): void => {
      if (params.val) params.elem.style.setProperty(params.prop, params.val);
      const time = delay || 20;
      setTimeout(() => {
        resolve(true);
        // doesn't work - for cause look forward
        // window.getComputedStyle(elem)[prop] == val ? resolve(true) : resolve(false);
      }, time);
    };

    const transformAndWaitEvent = () => {
      const eventHandler = (e: TransitionEvent): void => {
        if (e.target !== params.elem) return;

        if (e.propertyName !== params.prop) return;

        if (
          params.valToWait &&
          window.getComputedStyle(params.elem).getPropertyValue(params.prop) !==
            params.valToWait
        ) {
          return;
        }

        params.elem.removeEventListener('transitionend', eventHandler);
        params.elem.removeEventListener('transitioncancel', eventHandler);

        // val should be equal to style ! For example translate != matrix...
        // if(val) window.getComputedStyle(elem)[prop] == val ? resolve(true) : reject(false);
        // else
        resolve(true);
      };

      params.elem.addEventListener('transitionend', eventHandler);
      params.elem.addEventListener('transitioncancel', eventHandler);

      if (params.val) params.elem.style.setProperty(params.prop, params.val);
    };

    if (params.forceAutoresolveIn)
      transformAndAutoresolve(params.forceAutoresolveIn);
    else if (
      params.valToWait &&
      window.getComputedStyle(params.elem).getPropertyValue(params.prop) ===
        params.valToWait
    )
      transformAndAutoresolve();
    else {
      const style = window.getComputedStyle(params.elem);
      const duration = getTransitionDuration(style, params.prop);

      if (!duration || duration === '0s') {
        transformAndAutoresolve();
      } else {
        transformAndWaitEvent();
      }
    }
  });
}

export function commitStyles(a: Animation): void {
  try {
    const anim = a as unknown as Record<string, unknown>;
    if ('commitStyles' in anim && typeof anim.commitStyles === 'function')
      anim.commitStyles();
  } catch {
    //
  }
}

export type AnimationDef = {
  keyframes: Keyframe[];
  options: KeyframeAnimationOptions;
};

export function playAnimation(
  def: AnimationDef,
  element: HTMLElement,
  safeAwaitFactor?: number,
  abortSignal?: EventTarget,
): [Animation, Promise<void>] {
  const animDef = OBJ_PROCESSOR.deepClone(def);

  const delayStart = extractTimeInMS(animDef.options.delay);
  const duration = extractTimeInMS(animDef.options.duration);
  const delayEnd = extractTimeInMS(animDef.options.endDelay);

  animDef.options.delay = delayStart;
  animDef.options.duration = duration;
  animDef.options.endDelay = delayEnd;

  try {
    const anim = element.animate(animDef.keyframes, animDef.options);
    const finishPromise = new Promise<void>(res => {
      anim.onfinish = () => {
        commitStyles(anim);
        anim.cancel();
        res();
      };
      anim.oncancel = () => {
        commitStyles(anim);
        res();
      };

      abortSignal?.addEventListener('abort', () => anim.cancel());

      if (
        !animDef.options.iterations ||
        Number.isFinite(animDef.options.iterations)
      ) {
        const timeout = delayStart + duration + delayEnd;
        const safeFactor = safeAwaitFactor !== undefined ? safeAwaitFactor : 1;

        setTimeout(() => {
          commitStyles(anim);
          anim.cancel();
          res();
        }, timeout * safeFactor);
      }
    });
    return [anim, finishPromise];
  } catch {
    throw new Error(`can't animate`);
  }
}
