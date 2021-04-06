export const newDiagram = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:flowable="http://flowable.org/bpmn" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" typeLanguage="http://www.w3.org/2001/XMLSchema" expressionLanguage="http://www.w3.org/1999/XPath" targetNamespace="http://www.flowable.org/processdef">
  <process id="abc" name="abc" isExecutable="true">
    <documentation>cba</documentation>
    <startEvent id="startEvent1" flowable:formFieldValidation="true"></startEvent>
    <endEvent id="sid-C96863F1-2737-49E0-B6D3-AE89FA38B5DC"></endEvent>
    <sequenceFlow id="sid-35E4F502-0C97-4DBB-A21F-013E07747388" sourceRef="startEvent1" targetRef="sid-C96863F1-2737-49E0-B6D3-AE89FA38B5DC"></sequenceFlow>
    <userTask id="sid-640DE89C-1244-4427-A149-FF55B38A32FA" name="名字" flowable:formFieldValidation="true"></userTask>
    <sequenceFlow id="sid-B3C6D46A-7E1E-4D3A-90C6-6D88BA2396A5" sourceRef="startEvent1" targetRef="sid-640DE89C-1244-4427-A149-FF55B38A32FA"></sequenceFlow>
    <userTask id="sid-E1C08CD2-D27A-49E8-A3F7-435F723CE9D8" name="大哥" flowable:formFieldValidation="true"></userTask>
    <sequenceFlow id="sid-2D07A1F3-27F6-4D4A-AB79-08E79717690D" sourceRef="sid-640DE89C-1244-4427-A149-FF55B38A32FA" targetRef="sid-E1C08CD2-D27A-49E8-A3F7-435F723CE9D8"></sequenceFlow>
  </process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_abc">
    <bpmndi:BPMNPlane bpmnElement="abc" id="BPMNPlane_abc">
      <bpmndi:BPMNShape bpmnElement="startEvent1" id="BPMNShape_startEvent1">
        <omgdc:Bounds height="30.0" width="30.0" x="120.0" y="150.0"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="sid-C96863F1-2737-49E0-B6D3-AE89FA38B5DC" id="BPMNShape_sid-C96863F1-2737-49E0-B6D3-AE89FA38B5DC">
        <omgdc:Bounds height="28.0" width="28.0" x="195.0" y="151.0"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="sid-640DE89C-1244-4427-A149-FF55B38A32FA" id="BPMNShape_sid-640DE89C-1244-4427-A149-FF55B38A32FA">
        <omgdc:Bounds height="80.0" width="100.0" x="345.0" y="270.0"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="sid-E1C08CD2-D27A-49E8-A3F7-435F723CE9D8" id="BPMNShape_sid-E1C08CD2-D27A-49E8-A3F7-435F723CE9D8">
        <omgdc:Bounds height="80.0" width="100.0" x="490.0" y="270.0"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge bpmnElement="sid-2D07A1F3-27F6-4D4A-AB79-08E79717690D" id="BPMNEdge_sid-2D07A1F3-27F6-4D4A-AB79-08E79717690D">
        <omgdi:waypoint x="444.95000000000005" y="310.0"></omgdi:waypoint>
        <omgdi:waypoint x="489.9999999999807" y="310.0"></omgdi:waypoint>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge bpmnElement="sid-35E4F502-0C97-4DBB-A21F-013E07747388" id="BPMNEdge_sid-35E4F502-0C97-4DBB-A21F-013E07747388">
        <omgdi:waypoint x="149.94999666485123" y="165.0"></omgdi:waypoint>
        <omgdi:waypoint x="195.0" y="165.0"></omgdi:waypoint>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge bpmnElement="sid-B3C6D46A-7E1E-4D3A-90C6-6D88BA2396A5" id="BPMNEdge_sid-B3C6D46A-7E1E-4D3A-90C6-6D88BA2396A5">
        <omgdi:waypoint x="135.0" y="179.94999492851193"></omgdi:waypoint>
        <omgdi:waypoint x="135.0" y="225.0"></omgdi:waypoint>
        <omgdi:waypoint x="395.0" y="225.0"></omgdi:waypoint>
        <omgdi:waypoint x="395.0" y="270.0"></omgdi:waypoint>
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane> 
  </bpmndi:BPMNDiagram>
</definitions>`
