import {
  Component,
  Prop,
} from 'vue-property-decorator';
import './ComponentExample.sass';
import { DynamicComponent } from '@/docs/components/DynamicComponent';
import { Button, Panel, ExpandTransition } from '@/components';
import { CodeView } from '@/docs/components';
import TsxComponent from '@/vue-tsx';

interface Props {
  exampleId: string;
  tip?: string | null;
  docs?: string | null;
  sourcecode?: string;
  title?: string;
  component?: object;
  condensed: boolean;
  fullscreenOnly: boolean;
}

@Component({
  name: 'ComponentExample',
  components: {
    Button,
    DynamicComponent,
    ExpandTransition,
  },
})
export class ComponentExample extends TsxComponent<Props> {
  @Prop({ type: String, required: true })
  public exampleId!: string;

  @Prop({ type: String, default: null })
  public tip!: string | null;

  @Prop({ type: String, default: null })
  public docs!: string | null;

  @Prop({ type: String, default: '' })
  public sourcecode!: string;

  @Prop({ type: String, default: '' })
  public title!: string;

  @Prop({ type: Boolean, default: false })
  public condensed!: boolean;

  @Prop({ type: Boolean, default: false })
  public fullscreenOnly!: boolean;

  @Prop({ type: Boolean, default: false })
  public isFullscreenExample!: boolean;

  @Prop({ type: Object })
  public component!: object;

  get currentCode(): string { return this.sourcecode; }
  private codeShown = false;
  public render() {
    const buttonTitle = this.codeShown ? 'Hide Code' : 'Show Code';
    const iconClass = this.codeShown ? 'fas fa-caret-up' : 'fas fa-caret-down';
    const renderCodeIfNeeded = () => {
      const backgroundColor = 'rgb(250, 250, 250) !important';
      const style = {
        'background-color': backgroundColor,
        'border-top': '1px solid #eeeeef',
        'padding': '10px',
      };
      return (
        <ExpandTransition>
          <div v-show={this.codeShown} style={style}>
            {/* Needs to be wrapped again for the transition to look nice. */}
            <div><CodeView key={this.title} backgroundColor={backgroundColor} sourcecode={this.currentCode} /></div>
          </div>
        </ExpandTransition>
      );
    };
    const tip = this.tip;
    const routeData = this.$router.resolve({
      name: 'example-demo',
      params: { id: this.exampleId },
    });

    return (
      <div class='component-example'>
        <h1 class='example-title'>
          {this.title}
          <Button
            compact={true}
            styling='light'
            type='standard'
            class='fullscreen-demo-button'
            icon='popup-window'
            on-click={() => window.open(routeData.href, '__blank')}
          />
        </h1>
        {this.docs &&
          <div class='docs' domPropsInnerHTML={this.docs} />
        }
        <Panel condensed={true} condensedFooter={true}>
          {!!tip &&
            <div class='tip'>
              <div class='tip-title'>TIP</div>
              <div class='tip-body' domPropsInnerHTML={tip} />
            </div>
          }

          <div class='component'>
          {this.fullscreenOnly ?
            <div class='component__default-margin' style='display: flex; justify-content: center;'>
              <Button
                style='margin-left: auto; margin-right: auto;'
                type='standard'
                icon='popup-window'
                on-click={() => window.open(routeData.href, '__blank')}
              >
                Show Demo
              </Button>
            </div>
            :
            <DynamicComponent
              class={this.condensed ? 'component__condensed' : 'component__default-margin'}
              component={this.component}
            />
          }
          </div>
          <div slot='footer' class='footer'>
            <div
              class='example__show_code'
              role='button'
              on-click={event => this.toggleCode(event)}
            >
              <a href='#'>
                <i class={iconClass} />
                <span style='margin-left: 4px; line-height: 44px; font-size: 13px;'>{buttonTitle}</span>
              </a>
            </div>
            {renderCodeIfNeeded()}
          </div>
        </Panel>
      </div>
    );
  }

  private toggleCode(event: Event | undefined) {
    if (event) { event.preventDefault(); }
    this.codeShown = !this.codeShown;
  }
}