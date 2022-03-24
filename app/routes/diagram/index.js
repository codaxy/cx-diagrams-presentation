import Controller from './Controller';
import { Rectangle, Svg } from 'cx/svg';
import { Repeater } from 'cx/ui';
import { Cell, Diagram, Flow, Rotate, Shape, StraightLine, TwoSegmentLine } from 'cx-diagrams';

export default (
   <cx>
      <Svg controller={Controller} class="h-auto">
         <Diagram showGrid unitSize={48} center>
            <Rotate turns={4}>
               <Flow direction="right" gap={5} align="center">
                  <Flow direction="down" gap={1}>
                     <Repeater records-bind="$page.diagram.peRouters" recordAlias="$pe">
                        <Cell>
                           <Shape
                              shape="circle"
                              text-bind="$pe.name"
                              id-bind="$pe.id"
                              class="fill-yellow-300 stroke-yellow-500"
                           />
                        </Cell>
                     </Repeater>
                  </Flow>
                  <Flow direction="down" gap={1}>
                     <Repeater records-bind="$page.diagram.regions" recordAlias="$region">
                        <Flow direction="right" p={0.5} gap={3} align="center">
                           <Rectangle class="fill-gray-200" />
                           <Flow direction="down" gap={20}>
                              <Repeater records-bind="$region.coreSwitches" recordAlias="$cs">
                                 <Cell width={1.5}>
                                    <Shape
                                       text-bind="$cs.name"
                                       id-bind="$cs.id"
                                       class="fill-blue-300 stroke-blue-800"
                                    />
                                 </Cell>
                              </Repeater>
                           </Flow>

                           <Repeater records-bind="$region.rings" recordAlias="$ring">
                              <Flow direction="down" gap={1}>
                                 <Repeater records-bind="$ring.ringSwitches" recordAlias="$ringSw">
                                    <Flow direction="right" gap={0.5} align="center">
                                       <Cell>
                                          <Shape
                                             text-bind="$ringSw.name"
                                             id-bind="$ringSw.id"
                                             class="fill-blue-200 stroke-blue-700"
                                          />
                                       </Cell>
                                       <Flow direction="down" gap={0.5}>
                                          <Repeater records-bind="$ringSw.lines" recordAlias="$line">
                                             <Flow direction="right" gap={0.5} align="center">
                                                <Cell>
                                                   <Shape
                                                      text-bind="$line.cascadeSwitch.name"
                                                      id-bind="$line.cascadeSwitch.id"
                                                      class="fill-orange-200 stroke-orange-700"
                                                   />
                                                </Cell>
                                                <Cell>
                                                   <Shape
                                                      text-bind="$line.cpe.name"
                                                      id-bind="$line.cpe.id"
                                                      class="fill-green-200 stroke-green-700"
                                                   />
                                                </Cell>
                                                <Cell>
                                                   <Shape
                                                      text-bind="$line.unmanaged.name"
                                                      id-bind="$line.unmanaged.id"
                                                      class="fill-gray-200 stroke-gray-700"
                                                   />
                                                </Cell>
                                             </Flow>
                                          </Repeater>
                                       </Flow>
                                    </Flow>
                                 </Repeater>
                              </Flow>
                           </Repeater>

                           <Repeater records-bind="$region.coreSwitches" recordAlias="$cs">
                              <Repeater records-bind="$cs.connections" recordAlias="$to">
                                 <TwoSegmentLine
                                    from-bind="$cs.id"
                                    to-bind="$to.id"
                                    stroke="black"
                                    startOffset-expr="({$index} - {$cs.connections.length}/2 + 0.5) * 10"
                                 />
                              </Repeater>
                           </Repeater>
                        </Flow>
                     </Repeater>
                  </Flow>
               </Flow>
               <Repeater records-bind="$page.diagram.connections" recordAlias="$conn">
                  <StraightLine from-bind="$conn.from.id" to-bind="$conn.to.id" stroke="black" />
               </Repeater>
            </Rotate>
         </Diagram>
      </Svg>
   </cx>
);
