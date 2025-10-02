{{- define "guestbook.name" -}}
guestbook
{{- end }}

{{- define "guestbook.fullname" -}}
{{- printf .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- end }}
