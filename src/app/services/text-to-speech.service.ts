import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TextToSpeechService {
  private apiKey = '4d039b745fmshf1f9b45f862efbep112490jsna94b5d5d51be'; // Replace with your API key
  private apiUrl = 'https://voicerss-text-to-speech.p.rapidapi.com/';

  constructor(private http: HttpClient) { }

  speak(text: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'x-rapidapi-host': 'voicerss-text-to-speech.p.rapidapi.com',
      'x-rapidapi-key': this.apiKey
    });

    const body = new URLSearchParams();
    body.set('src', text);
    body.set('hl', 'en-us');
    body.set('r', '0');
    body.set('c', 'mp3');
    body.set('f', '8khz_8bit_mono');

    return this.http.post(this.apiUrl, body.toString(), { headers, responseType: 'blob' }).pipe(
      catchError(error => {
        console.error('Error calling text-to-speech service:', error);
        return throwError(error);
      })
    );
  }
}
