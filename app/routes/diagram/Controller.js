import { generateDiagram } from './model';

export default {
   onInit() {
      this.store.set('$page.diagram', generateDiagram());
   },
};
