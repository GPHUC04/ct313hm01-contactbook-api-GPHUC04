for ($i = 1; $i -le 21; $i++) {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/v1/contacts" -Method Get -ErrorAction SilentlyContinue
    $statusCode = if ($response) { $response.StatusCode } else { "N/A" }
    Write-Host "Request ${i}: Status Code $statusCode"
    Start-Sleep -Seconds 2
}