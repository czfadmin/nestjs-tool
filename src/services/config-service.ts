import {
  EventEmitter,
  ExtensionContext,
  workspace,
  WorkspaceConfiguration,
  Event,
} from 'vscode';
import {ExtConfiguration} from '../types';
import {ServiceManager} from './service-manager';
import {EXTENSION_ID} from '../constants';

export class ConfigService implements Disposable {
  private _configuration!: ExtConfiguration;

  private _context: ExtensionContext;
  private _wsConfiguration: WorkspaceConfiguration;

  private _onConfigurationChangeEvent = new EventEmitter<ExtConfiguration>();

  onConfigurationChange: Event<ExtConfiguration> =
    this._onConfigurationChangeEvent.event;

  get configuration() {
    return this._configuration;
  }

  constructor(private sm: ServiceManager) {
    this._context = this.sm.context;
    this._wsConfiguration = workspace.getConfiguration(EXTENSION_ID);
    this._initial();
  }

  private _initial() {
    this.resolveConfiguration();
    workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration(EXTENSION_ID)) {
        this._wsConfiguration = workspace.getConfiguration(EXTENSION_ID);
        this.resolveConfiguration();
        this._fire();
      }
    });
  }

  private _getItemByKey(key: string, defaultValue: any) {
    return this._wsConfiguration.get<typeof defaultValue>(key, defaultValue);
  }

  resolveConfiguration(): ExtConfiguration {
    this._configuration = {
      showTerminal: this._getItemByKey('showTerminal', true),
      shouldExecute: this._getItemByKey('shouldExecute', true),
      noSpec: this._getItemByKey('noSpec', false),
      spec: this._getItemByKey('spec', true),
      noFlat: this._getItemByKey('noFlat', false),
      flat: this._getItemByKey('flat', true),
      skipImport: this._getItemByKey('skipImport', false),
    };

    return this._configuration;
  }
  private _fire() {
    this._onConfigurationChangeEvent.fire(this._configuration);
  }
  [Symbol.dispose](): void {
    this._onConfigurationChangeEvent.dispose();
  }
}
