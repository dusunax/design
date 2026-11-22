// render_ui 도구와 시스템 프롬프트. DOC-13 평가에 쓴 FLAT_SYSTEM을 그대로 옮겼다.
const EXAMPLE = {
  surfaceId: "signup",
  dataModel: { name: "", email: "" },
  components: [
    { id: "root", component: "Card", child: "form" },
    { id: "form", component: "Column", children: ["title", "name", "email", "submit"] },
    { id: "title", component: "Text", text: "Sign up" },
    { id: "name", component: "TextField", label: "Name", value: { path: "/name" } },
    { id: "email", component: "TextField", label: "Email", value: { path: "/email" } },
    { id: "submit", component: "Button", child: "submitLabel", variant: "primary", action: { event: { name: "signup", context: { name: { path: "/name" }, email: { path: "/email" } } } } },
    { id: "submitLabel", component: "Text", text: "Sign up" },
  ],
};

export const SYSTEM_PROMPT = `You can show UI with the render_ui tool. Call it whenever a form, list or choice helps.
The arguments describe one surface: {"surfaceId": string, "components": Component[], "dataModel"?: object}. Rules:
1. "components" is a flat array. A component is a flat object: {"id", "component", ...props}. Put props directly on the component. Never use a "props" or "style" object.
2. The root component has id "root". Every id you reference must exist.
3. Row, Column and List take "children": an array of id strings. Card and Button take "child": one id string. A Button's child is the id of a Text component, never the label itself.
4. Bind values to the data model with {"path": "/pointer"}; put initial values in "dataModel". A plain string is shown as-is.
5. Button actions are {"event": {"name": string, "context"?: {key: value or {"path"}}}}.
6. Components: Text{text,variant?: body|caption}, TextField{label,value,variant?: shortText|longText|number}, CheckBox{label,value}, ChoicePicker{label,options:[{label,value}],value:[...],variant?: mutuallyExclusive|multipleSelection}, Slider{label,min,max,value}, DateTimeInput{label,value,enableDate?,enableTime?}, Button{child,variant?: default|primary|borderless,action}, Row/Column/List{children}, Card{child}, Divider{}, Image{url,description}, Icon{name}, Tabs{tabs:[{title,child}]}.
Example arguments:
${JSON.stringify(EXAMPLE)}`;

export const RENDER_UI_TOOL = {
  type: "function",
  function: {
    name: "render_ui",
    description: "Show a UI card to the user.",
    parameters: {
      type: "object",
      properties: { surfaceId: { type: "string" }, components: { type: "array", items: { type: "object" } }, dataModel: { type: "object" } },
      required: ["surfaceId", "components"],
    },
  },
} as const;
