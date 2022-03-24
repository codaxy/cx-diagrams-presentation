import { uid } from 'uid';

interface Device {
   id: string;
   name: string;
}

interface Connection {
   from: Device;
   to: Device;
   offset?: number;
}

interface PE extends Device {}

interface CoreSwitch extends Device {
   connections: Device[];
}

interface CascadeSwitch extends Device {}

interface CPE extends Device {}

interface UnmanagedDevice extends Device {}

interface Line {
   cascadeSwitch?: CascadeSwitch;
   cpe?: CPE;
   unmanaged?: UnmanagedDevice;
}

interface Ring {
   ringSwitches: RingSwitch[];
}

interface RingSwitch extends Device {
   lines: Line[];
}

interface Region {
   coreSwitches: CoreSwitch[];
   rings: Ring[];
}

interface Diagram {
   peRouters: PE[];
   regions: Region[];
   connections: Connection[];
}

export function generateDiagram(): Diagram {
   let pe1: PE = { id: uid(), name: 'PE1' };
   let pe2: PE = { id: uid(), name: 'PE2' };

   let diagram: Diagram = {
      peRouters: [pe1, pe2],
      regions: [],
      connections: [],
   };

   diagram.regions.push(generateRegion(diagram, pe1, pe2));
   diagram.regions.push(generateRegion(diagram, pe1, pe2));

   return diagram;
}

function generateRegion(diagram: Diagram, pe1: PE, pe2: PE): Region {
   let cs1: CoreSwitch = { id: uid(), name: 'CS1', connections: [] };
   let cs2: CoreSwitch = { id: uid(), name: 'CS2', connections: [] };

   diagram.connections.push(
      {
         from: cs1,
         to: pe1,
      },
      { from: cs2, to: pe2 },
      { from: cs1, to: cs2 }
   );

   return {
      coreSwitches: [cs1, cs2],
      rings: [generateRing(diagram, cs1, cs2), generateRing(diagram, cs1, cs2), generateRing(diagram, cs1, cs2)],
   };
}

function generateRing(diagram: Diagram, c1: CoreSwitch, c2: CoreSwitch): Ring {
   let ring: Ring = {
      ringSwitches: [],
   };

   let prev: Device = null;

   for (let r = 0; r < 3; r++) {
      let rs: RingSwitch = { id: uid(), name: `RS${r + 1}`, lines: [] };
      ring.ringSwitches.push(rs);

      if (prev != null) diagram.connections.push({ from: prev, to: rs });
      prev = rs;

      for (let l = 0; l < 4; l++) {
         let line: Line = {
            cpe: { id: uid(), name: 'CPE' },
            cascadeSwitch: { id: uid(), name: 'CASW' },
            unmanaged: { id: uid(), name: 'UNM' },
         };

         diagram.connections.push({ from: rs, to: line.cascadeSwitch });
         diagram.connections.push({ from: line.cascadeSwitch, to: line.cpe });
         diagram.connections.push({ from: line.cpe, to: line.unmanaged });

         rs.lines.push(line);
      }
   }

   c1.connections.push(ring.ringSwitches[0]);
   c2.connections.push(ring.ringSwitches[ring.ringSwitches.length - 1]);

   return ring;
}
