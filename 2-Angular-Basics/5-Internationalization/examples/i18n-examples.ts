/**
 * Angular i18n (Internationalization) Examples
 * 
 * Covers:
 * - Setting up i18n in Angular
 * - Extracting strings for translation
 * - Using translation pipes and directives
 * - Dynamic locale switching
 * - XLIFF translation files
 * - Currency and date formatting by locale
 */

import { Component, OnInit } from '@angular/core';
import { LOCALE_ID, Inject } from '@angular/core';
import { formatDate, formatCurrency, getCurrencySymbol } from '@angular/common';

// ============================================================================
// 1. BASIC i18n SETUP AND STRING MARKING
// ============================================================================

/**
 * Component with strings marked for translation
 * Use i18n attribute on elements to mark strings for extraction
 */
@Component({
  selector: 'app-basic-i18n',
  template: `
    <div>
      <!-- Mark for translation -->
      <h1 i18n>Welcome to our application</h1>
      <p i18n>This is a sample message for translation</p>
      
      <!-- With interpolation -->
      <p i18n="@@greeting">Hello, {{ userName }}!</p>
      
      <!-- With description for translators -->
      <button i18n="Button label|@@btnSave">Save</button>
      <button i18n="Delete action">Delete</button>
      
      <!-- Pluralization -->
      <p i18n>
        You have {{ itemCount }} 
        <ng-container [ngPlural]="itemCount">
          <ng-template ngPluralCase="=0">items</ng-template>
          <ng-template ngPluralCase="=1">item</ng-template>
          <ng-template ngPluralCase="other">items</ng-template>
        </ng-container>
      </p>
    </div>
  `
})
export class BasicI18nComponent {
  userName = 'John';
  itemCount = 5;
}

// ============================================================================
// 2. TRANSLATION SERVICE WITH DYNAMIC SWITCHING
// ============================================================================

import { Observable, BehaviorSubject } from 'rxjs';

export interface TranslationStrings {
  [key: string]: string | TranslationStrings;
}

/**
 * Service for managing translations and locale switching
 */
export class TranslationService {
  private currentLocale = new BehaviorSubject<string>('en');
  locale$ = this.currentLocale.asObservable();

  private translations: { [locale: string]: TranslationStrings } = {
    en: {
      greeting: 'Hello',
      farewell: 'Goodbye',
      user: {
        profile: 'User Profile',
        settings: 'Settings',
        logout: 'Logout'
      },
      errors: {
        notFound: 'Page not found',
        unauthorized: 'Unauthorized access'
      }
    },
    de: {
      greeting: 'Hallo',
      farewell: 'Auf Wiedersehen',
      user: {
        profile: 'Benutzerprofil',
        settings: 'Einstellungen',
        logout: 'Abmelden'
      },
      errors: {
        notFound: 'Seite nicht gefunden',
        unauthorized: 'Unbefugter Zugriff'
      }
    },
    es: {
      greeting: 'Hola',
      farewell: 'Adiós',
      user: {
        profile: 'Perfil de Usuario',
        settings: 'Configuración',
        logout: 'Cerrar sesión'
      },
      errors: {
        notFound: 'Página no encontrada',
        unauthorized: 'Acceso no autorizado'
      }
    }
  };

  /**
   * Get translation for key with dot notation support
   */
  translate(key: string, locale?: string): string {
    const currentLocale = locale || this.currentLocale.value;
    const keys = key.split('.');
    let value: any = this.translations[currentLocale];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  }

  /**
   * Change current locale and load translations
   */
  setLocale(locale: string): void {
    this.currentLocale.next(locale);
    localStorage.setItem('locale', locale);
    document.documentElement.lang = locale;
  }

  /**
   * Get current locale
   */
  getLocale(): string {
    return this.currentLocale.value;
  }

  /**
   * Add translations for new locale
   */
  addTranslations(locale: string, strings: TranslationStrings): void {
    this.translations[locale] = {
      ...this.translations[locale],
      ...strings
    };
  }

  /**
   * Load translations from server
   */
  loadTranslationsFromServer(locale: string): Observable<TranslationStrings> {
    // In real app, fetch from server
    return new Observable(observer => {
      observer.next(this.translations[locale]);
      observer.complete();
    });
  }
}

// ============================================================================
// 3. TRANSLATION PIPE FOR DYNAMIC TRANSLATION
// ============================================================================

import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe for translating strings in templates
 * Usage: {{ 'user.profile' | translate }}
 */
@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {
  constructor(private translationService: TranslationService) {}

  transform(key: string, locale?: string): string {
    return this.translationService.translate(key, locale);
  }
}

// ============================================================================
// 4. COMPONENT WITH LOCALE-AWARE FORMATTING
// ============================================================================

/**
 * Component showing locale-specific formatting
 */
@Component({
  selector: 'app-locale-formatting',
  template: `
    <div>
      <h2>{{ 'greeting' | translate }}</h2>
      
      <!-- Locale-specific date formatting -->
      <p>Today: {{ currentDate | date: 'fullDate' }}</p>
      <p>Time: {{ currentDate | date: 'short' }}</p>
      
      <!-- Locale-specific currency formatting -->
      <p>Price: {{ price | currency }}</p>
      <p>Price (EUR): {{ price | currency: 'EUR' }}</p>
      <p>Price (JPY): {{ price | currency: 'JPY' }}</p>
      
      <!-- Locale-specific number formatting -->
      <p>Number: {{ largeNumber | number }}</p>
      <p>Percentage: {{ percentage | percent }}</p>
      
      <!-- Translation with dynamic data -->
      <p>{{ 'user.profile' | translate }}</p>
      
      <!-- Locale switcher -->
      <select (change)="changeLocale($event)">
        <option value="en">English</option>
        <option value="de">Deutsch</option>
        <option value="es">Español</option>
      </select>
    </div>
  `
})
export class LocaleFormattingComponent implements OnInit {
  currentDate = new Date();
  price = 1234.56;
  largeNumber = 1000000;
  percentage = 0.25;

  constructor(
    @Inject(LOCALE_ID) private localeId: string,
    private translationService: TranslationService
  ) {}

  ngOnInit() {
    // Get current locale from Angular
    console.log('Current locale:', this.localeId);
  }

  /**
   * Change locale and update formatting
   */
  changeLocale(event: any): void {
    const locale = event.target.value;
    this.translationService.setLocale(locale);
    // Force view update for date/currency pipes
  }

  /**
   * Manual formatting example
   */
  formatDateManually(): string {
    return formatDate(this.currentDate, 'medium', this.localeId);
  }

  /**
   * Manual currency formatting example
   */
  formatCurrencyManually(): string {
    return formatCurrency(this.price, this.localeId, '$');
  }
}

// ============================================================================
// 5. XLIFF TRANSLATION FILES EXAMPLE
// ============================================================================

/**
 * messages.xlf (English source)
 * 
 * <?xml version="1.0" encoding="UTF-8" ?>
 * <xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
 *   <file source-language="en" datatype="plaintext" original="ng2.template">
 *     <body>
 *       <trans-unit id="greeting" datatype="html">
 *         <source>Hello, World!</source>
 *         <context-group purpose="location">
 *           <context context-type="component">AppComponent</context>
 *         </context-group>
 *       </trans-unit>
 *       <trans-unit id="welcome" datatype="html">
 *         <source>Welcome to {{ appName }}</source>
 *         <note priority="1" from="meaning">Main greeting</note>
 *       </trans-unit>
 *     </body>
 *   </file>
 * </xliff>
 */

/**
 * messages.de.xlf (German translation)
 * 
 * <?xml version="1.0" encoding="UTF-8" ?>
 * <xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
 *   <file source-language="en" target-language="de" datatype="plaintext">
 *     <body>
 *       <trans-unit id="greeting" datatype="html">
 *         <source>Hello, World!</source>
 *         <target>Hallo, Welt!</target>
 *       </trans-unit>
 *       <trans-unit id="welcome" datatype="html">
 *         <source>Welcome to {{ appName }}</source>
 *         <target>Willkommen bei {{ appName }}</target>
 *       </trans-unit>
 *     </body>
 *   </file>
 * </xliff>
 */

// ============================================================================
// 6. ANGULAR.JSON CONFIGURATION FOR i18n
// ============================================================================

/**
 * Configure multiple locales in angular.json
 */
export const angularJsonI18nConfig = {
  i18n: {
    sourceLocale: 'en',
    locales: {
      de: {
        translation: 'locale/messages.de.xlf',
        baseUrl: '/de/'
      },
      es: {
        translation: 'locale/messages.es.xlf',
        baseUrl: '/es/'
      },
      fr: {
        translation: 'locale/messages.fr.xlf',
        baseUrl: '/fr/'
      }
    }
  },
  architect: {
    build: {
      configurations: {
        production: {
          i18nFile: 'locale/messages.xlf',
          i18nFormat: 'xlf',
          i18nLocale: 'en',
          i18nMissingTranslation: 'warning'
        }
      }
    }
  }
};

// ============================================================================
// 7. PLURALIZATION AND GENDER HANDLING
// ============================================================================

/**
 * Component with advanced translation features
 */
@Component({
  selector: 'app-advanced-i18n',
  template: `
    <div>
      <!-- Pluralization -->
      <p i18n>
        You have {{ messages }}
        <ng-container [ngPlural]="messages">
          <ng-template ngPluralCase="=0">no messages</ng-template>
          <ng-template ngPluralCase="=1">1 message</ng-template>
          <ng-template ngPluralCase="other">{{ messages }} messages</ng-template>
        </ng-container>
      </p>

      <!-- Gender selection (German example) -->
      <p *ngFor="let user of users">
        <ng-container i18n>
          {{ user.name }}
          <ng-container [ngSwitch]="user.gender">
            <ng-container *ngSwitchCase="'m'" i18n>is a manager</ng-container>
            <ng-container *ngSwitchCase="'f'" i18n>is a manager</ng-container>
          </ng-container>
        </ng-container>
      </p>

      <!-- Contextual translation with meaning -->
      <p i18n="@@actionClose">Close</p>
      <p i18n="@@statusClosed">Closed</p>
    </div>
  `
})
export class AdvancedI18nComponent {
  messages = 5;
  users = [
    { name: 'John', gender: 'm' },
    { name: 'Jane', gender: 'f' }
  ];
}

// ============================================================================
// 8. LOCALIZATION SERVICE WITH SERVER-SIDE LOADING
// ============================================================================

import { HttpClient } from '@angular/common/http';

/**
 * Enhanced localization service with server-side translation loading
 */
export class LocalizationService {
  private currentLocale = new BehaviorSubject<string>('en');
  private translations = new BehaviorSubject<TranslationStrings>({});

  constructor(private http: HttpClient) {
    this.initializeLocale();
  }

  /**
   * Initialize locale from localStorage or browser settings
   */
  private initializeLocale(): void {
    const savedLocale = localStorage.getItem('locale') || 
                       navigator.language.split('-')[0] || 
                       'en';
    this.setLocale(savedLocale);
  }

  /**
   * Set locale and load translations
   */
  setLocale(locale: string): void {
    this.currentLocale.next(locale);
    this.loadTranslations(locale);
  }

  /**
   * Load translations from server
   */
  private loadTranslations(locale: string): void {
    this.http.get<TranslationStrings>(`/assets/i18n/${locale}.json`)
      .subscribe(
        translations => this.translations.next(translations),
        error => console.error(`Failed to load ${locale} translations`, error)
      );
  }

  /**
   * Get translation observable
   */
  getTranslation$(key: string): Observable<string> {
    return this.translations.asObservable().pipe(
      map(trans => this.getNestedValue(trans, key) || key)
    );
  }

  /**
   * Get nested value from object using dot notation
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  }
}

import { map } from 'rxjs/operators';
