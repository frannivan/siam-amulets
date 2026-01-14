import { Pipe, PipeTransform, inject } from '@angular/core';
import { LanguageService } from '../services/language.service';

@Pipe({
    name: 'translate',
    standalone: true,
    pure: false // Necessary because translations load asynchronously
})
export class TranslatePipe implements PipeTransform {
    private langService = inject(LanguageService);

    transform(key: string, params?: any): string {
        return this.langService.translate(key, params);
    }
}
