/**
 * Angular CLI Advanced Features Examples
 * 
 * Covers:
 * - Project generation and configuration
 * - Custom schematics and code generation
 * - Performance optimization flags
 * - Build optimization strategies
 * - Environment-specific configurations
 * - Library creation and publishing
 */

// ============================================================================
// 1. CUSTOM WORKSPACE & PROJECT CONFIGURATION
// ============================================================================

/**
 * angular.json structure with advanced configurations
 * 
 * Commands:
 * - ng new workspace-name
 * - ng generate application app-name
 * - ng generate library shared-lib
 */
export const advancedAngularJson = {
  // Main project configuration
  projects: {
    myApp: {
      projectType: 'application',
      schematics: {
        '@schematics/angular:component': {
          style: 'scss',
          changeDetection: 'OnPush',
          skipTests: false
        },
        '@schematics/angular:application': {
          strict: true
        }
      },
      architect: {
        build: {
          builder: '@angular-devkit/build-angular:browser',
          options: {
            outputPath: 'dist/myApp',
            index: 'src/index.html',
            main: 'src/main.ts',
            polyfills: 'src/polyfills.ts',
            tsConfig: 'tsconfig.app.json',
            aot: true,
            sourceMap: false,
            optimization: true,
            buildOptimizer: true,
            namedChunks: false,
            extractLicenses: true,
            vendorChunk: false,
            // Performance budgets
            budgets: [
              {
                type: 'initial',
                maximumWarning: '2mb',
                maximumError: '5mb'
              },
              {
                type: 'anyComponentStyle',
                maximumWarning: '6kb',
                maximumError: '10kb'
              }
            ]
          }
        },
        serve: {
          builder: '@angular-devkit/build-angular:dev-server',
          options: {
            browserTarget: 'myApp:build',
            port: 4200,
            liveReload: true,
            ssl: false
          }
        }
      }
    }
  }
};

// ============================================================================
// 2. ENVIRONMENT-SPECIFIC CONFIGURATIONS
// ============================================================================

/**
 * Environment configuration management
 * 
 * Command: ng serve --configuration=production
 */
export const environmentConfig = {
  // environment.ts (development)
  development: {
    production: false,
    apiUrl: 'http://localhost:3000/api',
    logLevel: 'debug',
    enableAnalytics: false,
    cacheEnabled: false,
    debugMode: true
  },

  // environment.prod.ts (production)
  production: {
    production: true,
    apiUrl: 'https://api.example.com',
    logLevel: 'warn',
    enableAnalytics: true,
    cacheEnabled: true,
    debugMode: false
  },

  // environment.staging.ts (staging)
  staging: {
    production: false,
    apiUrl: 'https://staging-api.example.com',
    logLevel: 'info',
    enableAnalytics: true,
    cacheEnabled: true,
    debugMode: true
  }
};

// ============================================================================
// 3. CUSTOM SCHEMATICS FOR CODE GENERATION
// ============================================================================

/**
 * Custom schematic for generating feature modules
 * 
 * Usage:
 * - ng generate @mylib/feature --name=dashboard
 * - ng generate @mylib/crud --name=users --api=users-service
 */
export interface CustomSchematicOptions {
  name: string;
  path?: string;
  skipTests?: boolean;
  skipModule?: boolean;
  routing?: boolean;
}

export class SchematicGenerator {
  /**
   * Generate feature module with routing and lazy loading
   */
  static generateFeatureModule(options: CustomSchematicOptions) {
    const template = `
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ${options.name}RoutingModule } from './${options.name}-routing.module';
import { ${options.name}Component } from './${options.name}.component';

@NgModule({
  declarations: [${options.name}Component],
  imports: [CommonModule, ${options.name}RoutingModule]
})
export class ${options.name}Module { }
    `;
    return template;
  }

  /**
   * Generate CRUD service from template
   */
  static generateCrudService(entity: string) {
    return `
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ${entity}Service {
  private apiUrl = '/api/${entity.toLowerCase()}';

  constructor(private http: HttpClient) {}

  getAll(): Observable<${entity}[]> {
    return this.http.get<${entity}[]>(this.apiUrl);
  }

  getById(id: string): Observable<${entity}> {
    return this.http.get<${entity}>(\`\${this.apiUrl}/\${id}\`);
  }

  create(item: ${entity}): Observable<${entity}> {
    return this.http.post<${entity}>(this.apiUrl, item);
  }

  update(id: string, item: ${entity}): Observable<${entity}> {
    return this.http.put<${entity}>(\`\${this.apiUrl}/\${id}\`, item);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(\`\${this.apiUrl}/\${id}\`);
  }
}
    `;
  }
}

// ============================================================================
// 4. ADVANCED BUILD OPTIMIZATION
// ============================================================================

/**
 * Build optimization configurations
 * 
 * Commands:
 * - ng build --prod --build-optimizer
 * - ng build --stats-json
 * - ng build --source-map=false
 */
export const buildOptimizationConfig = {
  // Bundle analysis
  analyzeBundle: `
    # Generate stats file
    ng build --stats-json
    
    # Analyze with webpack-bundle-analyzer
    webpack-bundle-analyzer dist/myApp/stats.json
  `,

  // Size optimization
  sizeOptimization: {
    // Tree shaking - remove unused code
    treeShaking: true,
    
    // Minification and obfuscation
    minification: true,
    
    // Lazy loading chunks
    lazyLoad: true,
    
    // Module concatenation
    concatenateModules: true
  },

  // AOT compilation optimization
  aotOptimization: {
    aot: true,
    buildOptimizer: true,
    sourceMap: false,
    extractLicenses: true,
    namedChunks: false,
    vendorChunk: false
  }
};

// ============================================================================
// 5. LIBRARY CREATION & PUBLISHING
// ============================================================================

/**
 * Create and publish reusable Angular libraries
 * 
 * Commands:
 * - ng generate library shared-lib
 * - ng build shared-lib --prod
 * - npm publish dist/shared-lib
 */
export class LibraryPublishingGuide {
  static setup = `
    # Generate library
    ng generate library @myorg/shared-components
    
    # Update package.json
    {
      "name": "@myorg/shared-components",
      "version": "1.0.0",
      "peerDependencies": {
        "@angular/common": "^15.0.0",
        "@angular/core": "^15.0.0"
      }
    }
    
    # Build library
    ng build @myorg/shared-components --prod
    
    # Publish
    npm publish dist/@myorg/shared-components
  `;

  static ngPackageConfig = {
    $schema: 'node_modules/ng-packagr/ng-package.schema.json',
    dest: '../../dist/@myorg/shared-components',
    lib: {
      entryFile: 'src/public-api.ts',
      flatModuleFile: 'shared-components',
      umdModuleIds: {
        '@angular/common': 'ng.common',
        '@angular/core': 'ng.core'
      }
    }
  };
}

// ============================================================================
// 6. CLI COMMANDS REFERENCE
// ============================================================================

/**
 * Essential Angular CLI commands for development and production
 */
export const cliCommandsReference = {
  // Project management
  projectManagement: {
    'ng new': 'Create new Angular workspace',
    'ng generate': 'Generate code (components, services, modules)',
    'ng add': 'Add external library with schematics'
  },

  // Development
  development: {
    'ng serve': 'Start development server',
    'ng serve --poll': 'Enable polling for file changes',
    'ng serve --ssl': 'Start with HTTPS',
    'ng serve --configuration=staging': 'Serve with specific configuration'
  },

  // Building
  building: {
    'ng build': 'Build for development',
    'ng build --prod': 'Build for production with optimizations',
    'ng build --stats-json': 'Generate bundle analysis stats',
    'ng build --source-map': 'Include source maps for debugging'
  },

  // Testing
  testing: {
    'ng test': 'Run unit tests (watch mode)',
    'ng test --watch=false': 'Run tests once',
    'ng test --code-coverage': 'Generate coverage report',
    'ng e2e': 'Run end-to-end tests'
  },

  // Linting and formatting
  linting: {
    'ng lint': 'Run linter',
    'ng lint --fix': 'Auto-fix linting issues'
  },

  // Deployment
  deployment: {
    'ng build --prod': 'Production build',
    'ng deploy': 'Deploy using @angular/fire or @angular/cli-deploy'
  }
};

// ============================================================================
// 7. WORKSPACE CONFIGURATION EXAMPLE
// ============================================================================

/**
 * Complete workspace setup with multiple projects
 */
export const workspaceExample = {
  // monorepo with apps and libraries
  structure: `
    workspace/
    ├── apps/
    │   ├── main-app/
    │   ├── admin-app/
    │   └── mobile-app/
    ├── libs/
    │   ├── shared-ui/
    │   ├── shared-services/
    │   └── shared-models/
    ├── angular.json
    ├── tsconfig.json
    └── nx.json (if using NX)
  `,

  // tsconfig.json path mappings for monorepo
  pathMappings: {
    '@myorg/shared-ui': ['libs/shared-ui/src/public-api.ts'],
    '@myorg/shared-services': ['libs/shared-services/src/public-api.ts'],
    '@myorg/shared-models': ['libs/shared-models/src/public-api.ts'],
    '@app/*': ['apps/main-app/src/app/*']
  }
};

// ============================================================================
// 8. PERFORMANCE BUDGETS & ANALYSIS
// ============================================================================

/**
 * Monitor and enforce bundle size limits
 */
export const performanceBudgetConfig = {
  // Set in angular.json under build.options.budgets
  budgets: [
    {
      type: 'initial',
      maximumWarning: '2mb',
      maximumError: '5mb'
    },
    {
      type: 'anyComponentStyle',
      maximumWarning: '6kb',
      maximumError: '10kb'
    }
  ],

  // Analyze bundle
  analyzeCommand: 'ng build --stats-json && webpack-bundle-analyzer dist/*/stats.json',

  // Check bundle size before deployment
  preDeploymentCheck: `
    ng build --prod
    # Compare with previous build
    # If exceeds budget, optimize code splitting and lazy loading
  `
};

// ============================================================================
// 9. SCHEMATIC TEMPLATE: GENERATING SMART COMPONENTS WITH FORMS
// ============================================================================

/**
 * Smart component generator template that includes reactive forms
 */
export const smartComponentTemplate = `
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-smart-form',
  templateUrl: './smart-form.component.html',
  styleUrls: ['./smart-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmartFormComponent implements OnInit {
  form!: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {
    this.loading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  submit() {
    if (this.form.valid) {
      this.store.dispatch(submitFormAction({ data: this.form.value }));
    }
  }
}
`;
