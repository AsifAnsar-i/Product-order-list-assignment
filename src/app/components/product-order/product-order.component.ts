import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { TextToSpeechService } from '../../services/text-to-speech.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-order',
  templateUrl: './product-order.component.html',
  styleUrls: ['./product-order.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class ProductOrderComponent implements OnInit {
  orderForm!: FormGroup;
  products = ['Pencil', 'Eraser', 'Pen']; 
  quantities = [1, 2, 3, 4, 5]; 
  showingOrder = false;
  orderList: any[] = [];
  noItemsMessage = '';

  constructor(
    private fb: FormBuilder,
    private textToSpeechService: TextToSpeechService
  ) {}

  ngOnInit(): void {
    this.orderForm = this.fb.group({
      orderItems: this.fb.array([this.createOrderItem()]),
    });
  }

  createOrderItem(): FormGroup {
    return this.fb.group({
      product: ['', Validators.required],
      quantity: ['', Validators.required],
    });
  }

  get orderItems(): FormArray {
    return this.orderForm.get('orderItems') as FormArray;
  }

  addRow(): void {
    const controls = this.orderItems.controls;
    const lastControl = controls[controls.length - 1];

    if (lastControl.invalid) {
      lastControl.markAllAsTouched();
      return; 
    }

    this.orderItems.push(this.createOrderItem());
  }

  showOrder(): void {
    this.showingOrder = true;
    this.orderList = this.orderItems.value.filter(
      (item: { product: any; quantity: any }) => item.product && item.quantity
    ); 

    if (this.orderList.length === 0) {
      this.noItemsMessage = 'No items added yet.';
    } else {
      this.noItemsMessage = '';
    }
  }

  readOrder(): void {
    if (this.orderList.length === 0) {
      console.log('No items to read out.');
      return;
    }

    const orderText = this.orderList
      .map((item) => `${item.product} ${item.quantity}`)
      .join(', ');

    this.textToSpeechService.speak(orderText).subscribe(
      (blob: Blob) => {
       
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);

       
        const playPromise = audio.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Audio is playing');
            })
            .catch((error) => {
              console.error('Error playing audio:', error);
              alert(
                'Failed to play audio. Please interact with the page to enable audio playback.'
              );
            });
        }

       
        audio.addEventListener('ended', () => {
          URL.revokeObjectURL(url);
        });
      },
      (error) => console.error('Error calling text-to-speech service:', error)
    );
  }
}
