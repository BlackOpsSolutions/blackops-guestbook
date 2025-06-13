Kubernetes Manifest Example with ENV Var for BGColours
``` 
apiVersion: apps/v1
kind: Deployment
metadata:
  name: guestbook-backend
  namespace: sample-webapp2
spec:
  replicas: 1
  selector:
    matchLabels:
      app: guestbook
  template:
    metadata:
      labels:
        app: guestbook
    spec:
      containers:
      - name: backend
        image: tblackedg/guestbook-backend:main
        ports:
        - containerPort: 3000
        env:
        - name: BG_COLOR
          # value: "#f0f8ff"  # Light blue
          value: "#ff0000"  # Red
```

Example Service for API Deployment

```
apiVersion: v1
kind: Service
metadata:
  name: guestbook-backend
  namespace: sample-webapp2
spec:
  selector:
    app: guestbook
  ports:
    - port: 80          # Service port (HTTP)
      targetPort: 3000  # Container port where backend listens
      protocol: TCP
  type: ClusterIP       # No LoadBalancer needed, Ingress will handle external traffic
```

Redis Deployment
```

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis
        image: redis:6
        ports:
        - containerPort: 6379
---
apiVersion: v1
kind: Service
metadata:
  name: redis
spec:
  selector:
    app: redis
  ports:
    - port: 6379
```

Ingress Example
This Ingress Example expects you to have nginx ingressclass added, and also External-DNS and Cert-Manager pre-configured
```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: guestbook-ingress
  namespace: sample-webapp2
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: cluster-issuer
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"  # Redirect HTTP to HTTPS
spec:
  tls:
    - hosts:
        - guestbook.uat.k8s.blackops.net
      secretName: guestbook-tls
  rules:
    - host: guestbook.uat.k8s.blackops.net
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: guestbook-backend
                port:
                  number: 80   

```
