{{- define "guestbook.name" -}}
guestbook
{{- end }}

{{- define "guestbook.fullname" -}}
{{- printf "%s-%s" .Release.Name (include "guestbook.name" .) | trunc 63 | trimSuffix "-" -}}
{{- end }}
