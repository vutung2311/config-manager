# Base stage - build the Go application
FROM golang:1.24-trixie AS base

WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./

# Copy pocketbase directory for local replace
COPY pocketbase ./pocketbase

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN go build -o /app/config-manager .

# Development stage - for development with volume mounting
FROM base AS development

# Install Air for hot reloading and curl for health checks
RUN go install github.com/air-verse/air@v1.61.5 && \
    apt-get update && apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

EXPOSE 8080

# Run Air for development (will be overridden by volume mounting in development)
CMD ["air"]

# Release stage - run the application
FROM debian:trixie-slim AS release

RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd -g 1001 -r config-manager \
    && useradd -r -u 1001 -g config-manager -s /sbin/nologin -d /app config-manager

COPY --from=base --chown=config-manager:config-manager /app/config-manager /app/config-manager

# Create data directory for PocketBase
RUN mkdir -p /app/pb_data && chown -R config-manager:config-manager /app/pb_data

USER config-manager

EXPOSE 8080

CMD ["/app/config-manager", "serve", "--http", "0.0.0.0:8080"]