import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { languages } from '../Models/Languages';
import { CommonModule } from '@angular/common';
import { AssemblyAI } from 'assemblyai'
import Tesseract, { imageType } from 'tesseract.js';
//import { createWorker, Worker } from 'tesseract.js';

@Component({
  selector: 'app-languagetrans',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
 
  templateUrl: './languagetrans.component.html',
  styleUrl: './languagetrans.component.css'
})
export class LanguagetransComponent {
  fromText : any;
  toText : any;
  lang = languages.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  fromLang : any = 'auto';
  toLang : any = 'hi';
  img : any;

  constructor(private http:HttpClient, ){
  }
  
  translate(){
    if(this.fromText){
      let text = this.fromText.trim();
      
      console.log(this.fromLang, this.toLang );
      console.log(encodeURI(text));

      let apiUrl = "https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl="+ this.fromLang + "&tl=" + this.toLang +"&q=" + encodeURI(text);
      if(text)
        this.http.get(apiUrl).subscribe((res: any)=>
        {      
          console.log(res)      
          this.toText=res[0];
        })
      }
    
    else  this.fromText = "Please enter text"
  }

  mediaRecorder: MediaRecorder | undefined;
  chunks: Blob[] = [];
  
  async startRecording() {
    const constraints: MediaStreamConstraints = { audio: true };
    try {
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.ondataavailable = event => {
        this.chunks.push(event.data);
      };
  
      this.mediaRecorder.start();
      this.fromText = 'listening...';
      document.getElementById('startRecording')!.setAttribute('disabled', 'true');
      document.getElementById('stopRecording')!.removeAttribute('disabled');
     // this.detectSilence();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }

  async detectSilence() {
    if (!this.mediaRecorder) return; // Ensure mediaRecorder is defined

    let isSpeaking = false;
    const SILENCE_THRESHOLD = 5000; // Adjust as needed

    // Create an audio context
    const audioContext = new AudioContext();
    const analyzer = audioContext.createAnalyser();

    const source = audioContext.createMediaStreamSource(this.mediaRecorder.stream);
    source.connect(analyzer);

    const checkSilence = () => { 
      const dataArray = new Uint8Array(analyzer.frequencyBinCount);
      analyzer.getByteFrequencyData(dataArray);
      
      const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
      if (average > SILENCE_THRESHOLD) {
        isSpeaking = true;
      } else {
        isSpeaking = false;
      }
    };

    // Check for silence every 500 milliseconds
    const silenceInterval = setInterval(() => {
      checkSilence();
      if (!isSpeaking) {
        clearInterval(silenceInterval);
        this.stopRecording();
      }
    }, 5000);
  }

  // async stopRecording() { 
  //   if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
  //     this.mediaRecorder.stop();
  //     this.fromText = 'Processing...'
  //     const blob = new Blob(this.chunks, { type: 'audio/wav' });
  //     this.chunks = [];
  //     const res = await this.transcribeAudio(blob)      
  //     this.fromText = res;
      
  //     document.getElementById('startRecording')!.removeAttribute('disabled');
  //     document.getElementById('stopRecording')!.setAttribute('disabled', 'true');
  //   }
  // }

  async stopRecording() { debugger
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();
      this.fromText = 'Processing...'
      this.mediaRecorder.onstop = async () => { debugger
        const blob = new Blob(this.chunks, { type: 'audio/wav' });
        this.chunks = [];
        const res = await this.transcribeAudio(blob)
        this.fromText = res;
        return res;
      };
            
      document.getElementById('startRecording')!.removeAttribute('disabled');
      document.getElementById('stopRecording')!.setAttribute('disabled', 'true');
    }
  }
  async handleRec(){
    const res = await this.stopRecording();
    this.fromText = res;
  }
  async transcribeAudio(blob: Blob) {
    try { debugger
      const client = new AssemblyAI({
        apiKey: '2e44819e848347c8a3d8b4af7051f590'
      })

      let params;
      if(this.fromLang == 'auto'){
        params = {
          audio: blob, //'https://www.ool.co.uk/wp-content/uploads/Spanish-A-Track-1.mp3',
          speaker_labels: true,
          language_detection: true,
        }
      }
      else {
        params = {
          audio: blob, // 'https://www.ool.co.uk/wp-content/uploads/Spanish-A-Track-1.mp3',
          speaker_labels: true,
          language_code: this.fromLang,
        }
      }
      const transcript = await client.transcripts.transcribe(params)
      console.log(transcript.text, transcript)
      // for (let utterance of transcript.utterances!) {
      //   console.log(`Speaker ${utterance.speaker}: ${utterance.text}`)
      // }
      return transcript.text      
    } 
    catch (error) {
      console.error('Error uploading audio:', error);
      return 'Error uploading audio'
    }
  }

  async handleImageUpload(): Promise<void> { 
    const imagePath = this.img //'https://i.stack.imgur.com/fIqVh.jpg';
    const extractedText = await this.extractTextFromImage(imagePath);
    console.log('Extracted text:', extractedText);
    this.fromText = extractedText
  }

  async extractTextFromImage(imagePath: string): Promise<string> {  
    try {
        const worker = Tesseract.createWorker();
        this.fromText = "Processing...";
        const result = await (await worker).recognize(imagePath);
        await (await worker).terminate();

        console.log(result);
        
        return result.data.text;
    } catch (error) {
        console.error('Error extracting text:', error);
        return 'Error extracting text';
    }
  }
  
}
