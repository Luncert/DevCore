import React, { Component, CSSProperties, DOMAttributes } from 'react';
import anime from 'animejs';

interface AnimatedElementProps extends DOMAttributes<HTMLElement>, AnimationProps {
  /**
   * Highest priority as animation config.
   */
  animation?: AnimationProps;
  disable?: boolean;
  className?: string;
  getRef?: (ref: React.RefObject<HTMLDivElement>) => void;
  style?: CSSProperties | undefined;
  as?: keyof React.ReactHTML;
}

export interface AnimationProps {
  base?: AnimationConfig
  focus?: AnimationConfig
  active?: AnimationConfig
  hover?: AnimationConfig
}

interface AnimationConfig {
  color?: string;
  backgroundColor?: string;
}

export default class AnimatedElement extends Component<AnimatedElementProps> {
  protected ref: React.RefObject<HTMLDivElement>;

  private color: string | undefined;

  private backgroundColor: string | undefined;

  private hovered: boolean;

  private focused: boolean;

  private animationProps: AnimationProps;

  private onMouseEnter: () => void;

  private onMouseLeave: () => void;

  private onMouseDown: () => void;

  private onMouseUp: () => void;

  private onFocus: () => void;

  private onBlur: () => void;

  constructor(props: AnimatedElementProps) {
    super(props);
    this.ref = React.createRef();

    if (this.props.getRef) {
      this.props.getRef(this.ref);
    }

    this.animationProps = {
      ...({
        base: props.base,
        focus: props.focus,
        active: props.active,
        hover: props.hover,
      } as AnimationProps),
      ...props.animation,
    };

    if (this.animationProps.hover) {
      this.onMouseEnter = this.wrapAimationToggle(
        this.startHoverAnimation.bind(this)
      );
      this.onMouseLeave = this.stopHoverAnimation.bind(this);
    }

    if (this.animationProps.active) {
      this.onMouseDown = this.wrapAimationToggle(
        this.startActiveAnimation.bind(this)
      );
      this.onMouseUp = this.stopActiveAnimation.bind(this);
    }

    if (this.animationProps.focus) {
      this.onFocus = this.wrapAimationToggle(
        this.startFocusAnimation.bind(this)
      );
      this.onBlur = this.stopFocusAnimation.bind(this);
    }

    this.detectColor();
  }

  componentWillUnmount(): void {
    this.onMouseEnter = () => {};
    this.onMouseLeave = () => {};
    this.onMouseDown = () => {};
    this.onMouseUp = () => {};
    this.onFocus = () => {};
    this.onBlur = () => {};
  }

  detectColor() {
    const { base } = this.animationProps;
    if (base) {
      this.color = base.color;
      this.backgroundColor = base.backgroundColor;
    }

    // let style = window.getComputedStyle(this.ref.current, null)
    // if (!this.color) {
    //   this.color = style.getPropertyValue('color')
    // }
    if (!this.color) {
      console.warn('failed to detect color for ' + this.ref)
    }
    // if (!this.backgroundColor) {
    //   this.backgroundColor = style.getPropertyValue('background-color')
    // }
    if (!this.backgroundColor) {
      console.warn('failed to detect backgroundColor for ' + this.ref)
    }
  }

  protected wrapAimationToggle(animator: () => void) {
    return () => {
      const { disable } = this.props;
      if (disable) {
        return;
      }

      animator();
    };
  }

  protected startFocusAnimation() {
    this.focused = true;
    this.ref.current.style.backgroundColor =
      this.animationProps.focus?.backgroundColor;
  }

  protected stopFocusAnimation() {
    this.focused = false;
    if (this.backgroundColor) {
      this.ref.current.style.backgroundColor = this.backgroundColor;
    }
  }

  protected startHoverAnimation() {
    this.animate({
      color: this.animationProps.hover?.color,
      backgroundColor: this.animationProps.hover?.backgroundColor,
      duration: 150,
    });
    this.hovered = true;
  }

  protected stopHoverAnimation() {
    const color =
      this.focused && this.animationProps.focus?.color
        ? this.animationProps.focus.color
        : this.color;
    const backgroundColor =
      this.focused && this.animationProps.focus?.backgroundColor
        ? this.animationProps.focus.backgroundColor
        : this.backgroundColor;
    this.animate({ color, backgroundColor, duration: 150 });
    this.hovered = false;
  }

  protected startActiveAnimation() {
    this.animate({
      color: this.animationProps.active?.color,
      backgroundColor: this.animationProps.active?.backgroundColor,
    });
  }

  protected stopActiveAnimation() {
    const color =
      this.hovered && this.animationProps.hover?.color
        ? this.animationProps.hover.color
        : this.color;
    const backgroundColor =
      this.hovered && this.animationProps.hover?.backgroundColor
        ? this.animationProps.hover.backgroundColor
        : this.backgroundColor;
    this.animate({ color, backgroundColor });
  }

  private animate({
    color,
    backgroundColor,
    duration = 100,
  }: {
    color: any;
    backgroundColor: any;
    duration?: number;
  }) {
    const props = {
      targets: this.ref.current,
      easing: 'easeInOutSine',
      duration,
    } as any;
    if (color) {
      props.color = color;
    }
    if (backgroundColor) {
      props.backgroundColor = backgroundColor;
    }
    anime(props);
  }

  render() {
    let props: any = Object.assign({}, this.props)
    delete props['active']
    delete props['hover']
    delete props['getRef']
    delete props['focus']
    delete props['active']
    delete props['hover']
    delete props['animation']
    delete props['disable']
    props.ref = this.ref;
    props.onMouseEnter = this.onMouseEnter;
    props.onMouseLeave = this.onMouseLeave;
    props.onMouseDown = this.onMouseDown;
    props.onMouseUp = this.onMouseUp;
    props.onFocus = this.onFocus;
    props.onBlur = this.onBlur;
    props.style = Object.assign(props.style || {}, {color: this.color, backgroundColor: this.backgroundColor})
    return React.createElement(props.as || 'div', props, this.props.children)
  }
}
