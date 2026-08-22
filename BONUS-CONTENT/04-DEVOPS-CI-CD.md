# Advanced DevOps & CI/CD Guide

## GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Build and Deploy

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Lint
      run: npm run lint

    - name: Build
      run: npm run build -- --configuration production

    - name: Run unit tests
      run: npm run test -- --watch=false --code-coverage

    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        files: ./coverage/lcov.info

    - name: Run E2E tests
      run: npm run e2e

    - name: Build Docker image
      run: docker build -t app:${{ github.sha }} .

    - name: Push to registry
      if: github.ref == 'refs/heads/main'
      run: |
        docker tag app:${{ github.sha }} ${{ env.REGISTRY }}/app:latest
        docker push ${{ env.REGISTRY }}/app:latest

  deploy:
    needs: build-and-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    
    steps:
    - name: Deploy to production
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.DEPLOY_HOST }}
        username: ${{ secrets.DEPLOY_USER }}
        key: ${{ secrets.DEPLOY_KEY }}
        script: |
          cd /app
          docker pull ${{ env.REGISTRY }}/app:latest
          docker-compose up -d

    - name: Slack notification
      uses: slackapi/slack-github-action@v1
      with:
        payload: |
          {
            "text": "Deployment to production completed successfully ✅"
          }
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

## GitLab CI Pipeline

```yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - deploy

variables:
  DOCKER_DRIVER: overlay2
  REGISTRY: registry.gitlab.com
  IMAGE_NAME: $CI_PROJECT_PATH

build:
  stage: build
  image: node:16-alpine
  script:
    - npm ci
    - npm run build -- --configuration production
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour
  only:
    - main
    - develop

test:
  stage: test
  image: node:16-alpine
  script:
    - npm ci
    - npm run lint
    - npm run test -- --watch=false --code-coverage
  coverage: '/Statements\s*:\s*(\d+\.?\d*)%/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

e2e:
  stage: test
  image: cypress/browsers:latest
  script:
    - npm ci
    - npm run build -- --configuration production
    - npx cypress run
  artifacts:
    paths:
      - cypress/videos/
    when: on_failure

deploy_staging:
  stage: deploy
  image: alpine:latest
  script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$DEPLOY_KEY" | ssh-add -
    - ssh-keyscan -H $DEPLOY_HOST >> ~/.ssh/known_hosts
    - ssh $DEPLOY_USER@$DEPLOY_HOST "cd /app && docker-compose pull && docker-compose up -d"
  only:
    - develop
  environment:
    name: staging
    url: https://staging.example.com

deploy_production:
  stage: deploy
  image: alpine:latest
  script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$DEPLOY_KEY" | ssh-add -
    - ssh-keyscan -H $PROD_HOST >> ~/.ssh/known_hosts
    - ssh $DEPLOY_USER@$PROD_HOST "cd /app && docker-compose pull && docker-compose up -d"
  only:
    - main
  when: manual
  environment:
    name: production
    url: https://example.com
```

## Kubernetes Deployment

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: angular-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: angular-app
  template:
    metadata:
      labels:
        app: angular-app
    spec:
      containers:
      - name: angular-app
        image: ghcr.io/myrepo/angular-app:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: angular-app-service
spec:
  selector:
    app: angular-app
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: LoadBalancer

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: angular-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: angular-app
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## Monitoring and Logging

```yaml
# docker-compose.yml with monitoring
version: '3.8'

services:
  app:
    build: .
    ports:
      - "80:80"
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    restart: unless-stopped

  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    depends_on:
      - prometheus
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin

  elk-stack:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.0.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
```

## Performance Monitoring

```typescript
// src/main.ts
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

if (!environment.production) {
  enableDebugTools(getDebugNode(document.querySelector('app-root')));
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

// Performance monitoring
if (environment.production && 'performance' in window) {
  window.addEventListener('load', () => {
    const perfData = performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log('Page Load Time: ' + pageLoadTime + 'ms');

    // Send to analytics service
    sendMetricsToAnalytics({
      pageLoadTime,
      domContentLoaded: perfData.domContentLoadedEventEnd - perfData.navigationStart,
      firstPaint: performance.getEntriesByType('navigation')[0]
    });
  });
}
```

## Best Practices

1. **Automate Testing** - Run tests on every push
2. **Code Quality** - Use SonarQube/CodeClimate
3. **Security Scanning** - Check for vulnerabilities
4. **Rollback Strategy** - Have quick rollback mechanism
5. **Blue-Green Deployment** - Zero-downtime deployments
6. **Monitoring** - Real-time alerts for issues
7. **Documentation** - Keep deployment docs updated
8. **Secrets Management** - Use environment variables for secrets

