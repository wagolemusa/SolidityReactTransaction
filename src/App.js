import  { Navbar, Welcame, Loader, Services, Footer, Transcations} from './components'

const App = () => {
  return (
   <div className='min-h-screen'>
     <div className='gradient-bg-welcome'>
       <Navbar />
       <Welcame />
     </div>
     <Services />
     <Transcations />
     <Footer />
   </div>
  )
}
export default App
