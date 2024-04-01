export interface ExtConfiguration {
  /**
   * 当将命令发送到Terminal实例后, 是否显示Terminal, 默认为True
   */
  showTerminal: boolean;

  /**
   * Indicates that the text being sent should be executed rather than just inserted in the terminal. The character(s) added are \n or \r\n, depending on the platform. This defaults to true
   */
  shouldExecute: boolean;

  /**
   *  Disable spec files generation
   */
  noSpec: boolean;

  /**
   * --spec
   * Enforce spec files generation. (default: true)
   * @default true
   */
  spec: boolean;

  /**
   * Enforce that directories are generated
   */
  noFlat: boolean;

  /**
   *  Enforce flat structure of generated element. (default: false)
   */
  flat: boolean;

  /**
   * Skip importing (default: false)
   * @default false
   */
  skipImport: boolean;
}

export interface IContextKey {
  actived: boolean;
  selectedModule: boolean;
  selectedProject: boolean;
  selectedApp: boolean;
}
