import Template from "./components/Template";
import TemplateProvider from './context/TemplateContext'

export default function App() {

  return (
    <TemplateProvider>
      <Template>fdas</Template>
    </TemplateProvider>
  )
}
