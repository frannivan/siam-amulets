import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product, ProductImage } from '../../../models/product.model';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-product-form',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, DragDropModule],
    templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnInit {
    product: Product = {
        id: 0,
        name: '',
        description: '',
        price: 0,
        sku: '',
        slug: '',
        active: true,
        images: [],
        stockLevel: 0
    };
    isEditMode = false;
    activeUploads = 0;
    uploading = false;

    constructor(
        private productService: ProductService,
        private route: ActivatedRoute,
        private router: Router,
        private cdr: ChangeDetectorRef,
        private ngZone: NgZone
    ) { }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        console.log('ProductFormComponent: Init. ID param:', id);

        if (id) {
            this.isEditMode = true;
            this.productService.getProductById(+id).subscribe({
                next: (p: Product) => {
                    this.ngZone.run(() => {
                        console.log('ProductFormComponent: Loaded product:', p);
                        this.product = p;
                        // Ensure images array exists
                        if (!this.product.images) {
                            this.product.images = [];
                        }
                        this.cdr.detectChanges(); // FORCE UI UPDATE
                    });
                },
                error: (err) => {
                    this.ngZone.run(() => {
                        console.error('ProductFormComponent: Failed to load product', err);
                        alert('Error loading product details. Please check console.');
                    });
                }
            });
        }
    }

    onFileSelected(event: any) {
        const files: FileList = event.target.files;
        if (files && files.length > 0) {
            this.activeUploads += files.length;
            this.uploading = true;
            this.cdr.detectChanges(); // Update UI to show "Uploading..."

            Array.from(files).forEach(file => {
                this.productService.uploadImage(file).subscribe({
                    next: (path: string) => {
                        console.log('Uploaded file path:', path);
                        const newImage: ProductImage = {
                            imageUrl: path,
                            isThumbnail: (this.product.images?.length || 0) === 0
                        };
                        if (!this.product.images) this.product.images = [];
                        this.product.images!.push(newImage);
                        this.activeUploads--;
                        if (this.activeUploads === 0) this.uploading = false;
                        this.cdr.detectChanges(); // FORCE UI UPDATE
                    },
                    error: (err: any) => {
                        console.error('Upload failed', err);
                        alert('Failed to upload image: ' + file.name);
                        this.activeUploads--;
                        if (this.activeUploads === 0) this.uploading = false;
                        this.cdr.detectChanges(); // FORCE UI UPDATE
                    }
                });
            });
            // Clear the input so selecting the same file again works
            event.target.value = '';
        }
    }

    removeImage(index: number) {
        if (!this.product.images) return;
        this.product.images!.splice(index, 1);
        // Ensure one thumbnail remains if possible
        if (this.product.images!.length > 0 && !this.product.images!.some((img: any) => img.isThumbnail)) {
            this.product.images![0].isThumbnail = true;
        }
    }

    setThumbnail(index: number) {
        if (!this.product.images) return;
        const img = this.product.images.splice(index, 1)[0];
        this.product.images.unshift(img);
        // Update isThumbnail flags to match new order (Index 0 is true)
        this.product.images.forEach((img: any, i: number) => {
            img.isThumbnail = i === 0;
        });
    }

    getPreviewUrl(path: string): string {
        if (!path) return '';
        if (path.startsWith('/uploads')) {
            return `${path}`;
        }
        return path;
    }

    onSubmit() {
        console.log('Submitting product:', this.product);
        if (this.isEditMode) {
            this.productService.updateProduct(this.product.id, this.product).subscribe({
                next: () => this.router.navigate(['/admin/products']),
                error: (err: any) => {
                    console.error('Update failed', err);
                    alert('Failed to update product');
                }
            });
        } else {
            this.productService.createProduct(this.product).subscribe({
                next: () => this.router.navigate(['/admin/products']),
                error: (err: any) => {
                    console.error('Create failed', err);
                    alert('Failed to create product');
                }
            });
        }
    }

    drop(event: CdkDragDrop<ProductImage[]>) {
        if (!this.product.images) return;
        moveItemInArray(this.product.images, event.previousIndex, event.currentIndex);
    }
}
