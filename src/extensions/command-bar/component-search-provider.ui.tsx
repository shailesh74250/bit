import React from 'react';
import Fuse from 'fuse.js';
import CommandBarUI, { SearchProvider } from './command-bar.ui';
import WorkspaceUI from '../workspace/workspace.ui';
import { ComponentModel } from '../component/ui';
import { ComponentID } from '../component';
import { ComponentItem } from './ui/component-item';
import { ReactRouterUI } from '../react-router/react-router.ui';

export default class ComponentSearchProvider implements SearchProvider {
  static dependencies = [CommandBarUI, WorkspaceUI, ReactRouterUI];
  static slots = [];
  static async provider(
    [commandBarUI, workspaceUI, reactRouterUI]: [CommandBarUI, WorkspaceUI, ReactRouterUI] /* config, slots: [] */
  ) {
    const commandSearcher = new ComponentSearchProvider(workspaceUI, reactRouterUI);
    commandBarUI.addSearcher(commandSearcher);
    return commandSearcher;
  }
  constructor(private workspaceUI: WorkspaceUI, private reactRouterUI: ReactRouterUI) {}

  private fuseComponents = new Fuse<ComponentModel>([], {
    // weight can be included here.
    // fields loses weight the longer it gets, so it seems ok for now.
    keys: ['id.fullName'],
  });

  test(term: string): boolean {
    return !term.startsWith('>') && term.length > 0;
  }

  search = (pattern: string, limit: number) => {
    this.refreshComponents();

    const searchResults = this.fuseComponents.search(pattern, { limit });

    return searchResults.map((x) => (
      <ComponentItem key={x.item.id.toString()} component={x.item} execute={() => this.execute(x.item.id)} />
    ));
  };

  private execute = (componentId: ComponentID) => {
    const nextUrl = `/${componentId.fullName}`;
    this.reactRouterUI.push(nextUrl);
  };

  private _prevList?: ComponentModel[] = undefined;
  private refreshComponents() {
    const components = this.workspaceUI.listComponents();
    if (!components) {
      this._prevList = undefined;
      return;
    }

    if (this._prevList === components) return;

    this.fuseComponents.setCollection(components);
    this._prevList = components;
  }
}
