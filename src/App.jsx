import { useState } from 'react';
import './App.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SelectComponent from './components/Select';
import InputComponent from './components/Input';
import Button from './components/Button';




<Footer />
// InputComponent.defaultProps = { label: 'Label', type: 'text', placeholder: 'Placeholder' };

const languageOptions = [
  {
    text: 'Youtube',
    value: 'youtube',
    icon: 'https://e7.pngegg.com/pngimages/125/937/png-clipart-youtube-logo-youtube-angle-logo-thumbnail.png',
  },

  // Resto de opciones con su texto, valor y URL del icono
];

InputComponent.defaultProps = { label: '', type: 'url', placeholder: 'https://example.com', name: 'url_website' };
function App() {

  const handleSubmit = async (event) => {


    event.preventDefault();

    let page = document.getElementsByName('platform').value;
    let videoUrl = document.getElementsByName('url_website').value;

    try {
      const response = await fetch('/download', {
        method: 'POST', // Cambiar el método a POST
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: videoUrl, page: page }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'video_descargado.mp4'; // Nombre del archivo a descargar
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Error al descargar el video');
      }
    } catch (error) {
      console.error('Error de red', error);
    }

  };







  return (
    <div className='[ w-full flex justify-center items-center ]'>
      <div className='[ w-full bg-gray-200 ] [ md:w-[1000px] ] [ lg:w-[1000px] ]'>
        <Navbar />

        <main>
          <article className='[ h-full bg-gray-600 flex justify-center items-center ] [ md:h-[50vh] ] [ lg:h-[50vh] ]'>
            <form onSubmit={handleSubmit} className='[  w-1/2 ]'  >
              <div className='[ flex gap-2 ]'>
                <div className='[ w-[30%] ]'>
                  <SelectComponent
                    options={languageOptions}
                    defaultValue="Selecione la Plataforma de Video a Descargar"
                    className="[ w-1/2 ]"
                    name={'platform'}
                  />
                </div>
                <div className='[ w-full ]'>
                  <InputComponent />
                </div>
                <div className='[ w-32 ]'>
                  <Button text={'Procesar'} type='primary' />
                </div>
              </div>
            </form>
          </article>

        </main>
        <Footer />

      </div>
    </div>
  );
}

export default App;
