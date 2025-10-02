{{- define "guestbook.name" -}}
guestbook
{{- end }}

{{- define "guestbook.fullname" -}}
{{- printf "%s-%s" .Release.Name  | trunc 63 | trimSuffix "-" -}}
{{- end }}
