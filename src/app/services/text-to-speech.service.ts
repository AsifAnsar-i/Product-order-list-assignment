import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class TextToSpeechService {
  private apiKey = '4d039b745fmshf1f9b45f862efbep112490jsna94b5d5d51be';
  private apiUrl = 'https://open-ai-text-to-speech1.p.rapidapi.com/';

  constructor(private http: HttpClient) {}

  speak(text: string): Observable<Blob> {
    const options = {
      method: 'POST',
      url: this.apiUrl,
      headers: {
        'x-rapidapi-key': this.apiKey,
        'x-rapidapi-host': 'open-ai-text-to-speech1.p.rapidapi.com',
        'Content-Type': 'application/json',
      },
      data: {
        model: 'tts-1',
        input: text,
        voice: 'alloy',
      },
      responseType: 'arraybuffer' as const 
    };

    return new Observable((observer) => {
      axios
        .request(options)
        .then((response) => {
          const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
          observer.next(audioBlob);
          observer.complete();
        })
        .catch((error) => {
          console.error('Error calling text-to-speech service:', error);
          observer.error(error);
        });
    });
  }
}
