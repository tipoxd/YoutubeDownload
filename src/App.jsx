import { useEffect, useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SelectComponent from './components/Select';
import InputComponent from './components/Input';
import Button from './components/Button';
import CustomTable from './components/CustomTable';
import Imagen from './components/Imagen';
import Avatar from './components/Avatar';



const languageOptions = [{
  text: "Youtube",
  value: "Youtube",
}, {
  text: "Instagram",
  value: "Instagram",
}];

InputComponent.defaultProps = {
  label: '',
  type: 'url',
  placeholder: 'https://example.com',
  name: 'url_website',
};

function App() {
  const [formData, setFormData] = useState({
    platform: '', // Valor por defecto para la plataforma
    url_website: '', // Valor por defecto para la URL del sitio web
  });
  const [QualityInfo, setQualityInfo] = useState([]);
  const [thumbnails, sethumbnails] = useState('');
  const [Title, setTitle] = useState('');
  const [Profile, setProfile] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }, () => {
      console.log(formData); // Aquí, dentro de la función de callback de setFormData
    });
  };


  const tableHeaders = ['Resolucion', 'Peso', 'Descargar'];


  const GetVideoInfo = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('/videoInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Enviar el objeto formData
      });



      if (response.ok) {

        const formats = await response.json();

        const uniqueByQuality = (arr) => {
          const qualityMap = new Map();

          arr.forEach((item) => {
            if (!qualityMap.has(item.quality) || parseFloat(item.sizeInMB) > parseFloat(qualityMap.get(item.quality).sizeInMB)) {
              qualityMap.set(item.quality, item);
            }
          });

          return Array.from(qualityMap.values());
        };

        const uniqueData = uniqueByQuality(formats.result);
        let tableData = [];
        // Aquí puedes mostrar las opciones de calidad disponibles en el front-end
        uniqueData.forEach(format => {


          tableData.push(
            [
              format.qualityLabel,
              format.sizeInMB + ' MB',
              <Button text={'Descargar'} onClick={() => DownloadVideo(format.qualityLabel, format.url)} type='primary' />]);
        });


        setQualityInfo(tableData);
        sethumbnails(formats.thumbnails);
        setTitle(formats.title);
        let profile = formats.urlprofile;
        profile = profile.split('@').pop();
        setProfile(profile);

        return;

      } else {
        console.error('Error al Obtner la Informacion');
      }
    } catch (error) {
      console.error('Error de red', error);
    }
  };
  const DownloadVideo = async (quality, link) => {

    try {
      const response = await fetch('/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          {
            quality: quality,
            link: link
          }), // Enviar el objeto formData
      });

      if (response.ok) {

        const videoBlob = await response.blob();

        // Crear una URL del Blob del video
        const videoUrl = window.URL.createObjectURL(videoBlob);

        // Crear un enlace (link) para descargar el video
        const a = document.createElement('a');
        a.href = videoUrl;
        a.download = 'video_descargado.mp4'; // Nombre del archivo a descargar
        a.click();

        // Liberar el objeto URL creado para evitar pérdidas de memoria
        window.URL.revokeObjectURL(videoUrl);
      } else {
        console.error('Error al Obtner la Informacion');
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
          <article className='[ h-full bg-gray-600 flex justify-center items-center flex-col gap-3 p-5 ] [ md:h-[50vh] ] [ lg:h-[80vh] ]'>

            {thumbnails && <Imagen Src={thumbnails} ClassName='mx-auto object-cover' Alt='Photo' />}
            <div className='[ flex flex-nowrap gap-3 items-center justify-center w-full ]'>
              {<h1 className='w-72'>{Title}</h1>}
              {Profile && <Avatar Src={Profile} Alt="" Title="" />}
            </div>
            <form onSubmit={GetVideoInfo} className='[  w-1/2 ]'>
              <div className='[ flex gap-2 ]'>
                <div className='[ w-[50%] ]'>
                  <SelectComponent
                    options={languageOptions}
                    defaultValue="Selecciona la Plataforma de Video a Descargar"
                    className="[ w-1/2 ]"
                    name='platform'
                    onChange={handleInputChange}
                  />
                </div>
                <div className='[ w-full ]'>
                  <InputComponent
                    placeholder='https://example.com'
                    name='url_website'
                    onChange={handleInputChange}
                  />
                </div>
                <div className='[ w-32 ]'>
                  <Button text={'Buscar'} onClick={GetVideoInfo} type='primary' />


                  {/* <button class="btn btn-primary">Primary</button> */}

                </div>
              </div>
            </form>
            {thumbnails && <CustomTable headers={tableHeaders} data={QualityInfo} />}
          </article>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
