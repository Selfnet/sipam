{{/*
Return the proper backend image name
*/}}
{{- define "sipam.backend.image" -}}
{{ include "common.images.image" (dict "imageRoot" .Values.backend.image "global" .Values.global) }}
{{- end -}}

{{/*
Return the proper frontend image name
*/}}
{{- define "sipam.frontend.image" -}}
{{ include "common.images.image" (dict "imageRoot" .Values.frontend.image "global" .Values.global) }}
{{- end -}}

{{/*
Return the proper Docker Image Registry Secret Names
*/}}
{{- define "sipam.imagePullSecrets" -}}
{{- include "common.images.pullSecrets" (dict "images" (list .Values.backend.image .Values.frontend.image) "global" .Values.global) -}}
{{- end -}}

{{/*
Create the name of the service account to use
*/}}
{{- define "sipam.serviceAccountName" -}}
{{- if .Values.serviceAccount.create -}}
    {{ default (printf "%s" (include "common.names.fullname" .)) .Values.serviceAccount.name }}
{{- else -}}
    {{ default "default" .Values.serviceAccount.name }}
{{- end -}}
{{- end -}}

{{/*
Create the name of the secret to use for the django secret.
*/}}
{{- define "sipam.secrets.django.secret.name" -}}
{{ include "common.secrets.name" (dict "existingSecret" .Values.backend.djangoSecret "defaultNameSuffix" "secret-key" "context" . )}}
{{- end -}}

{{/*
Create the key of the secret to use for the django secret.
*/}}
{{- define "sipam.secrets.django.secret.key" -}}
{{ include "common.secrets.key" (dict "existingSecret" .Values.backend.djangoSecret "key" "secretKey" "context" .) }}
{{- end -}}

{{/*
Create the name of the secret to use for the db secret.
*/}}
{{- define "sipam.secrets.db.secret.name" -}}
{{ include "common.secrets.name" (dict "existingSecret" .Values.backend.dbSecret "defaultNameSuffix" "db-password" "context" . )}}
{{- end -}}

{{/*
Create the key of the secret to use for the db secret.
*/}}
{{- define "sipam.secrets.db.secret.key" -}}
{{ include "common.secrets.key" (dict "existingSecret" .Values.backend.dbSecret "key" "password" "context" .) }}
{{- end -}}

{{/* vim: set filetype=mustache: */}}
{{/*
Renders a value that contains template.
Usage:
{{ include "common.tplvalues.render" ( dict "value" .Values.path.to.the.Value "context" $) }}
*/}}
{{- define "sipam.tplvalues.render.json" -}}
    {{- if typeIs "string" .value }}
        {{- tpl .value .context }}
    {{- else }}
        {{- tpl (.value | toPrettyJson) .context }}
    {{- end }}
{{- end -}}



{{/*
Compile all warnings into a single message.
*/}}
{{- define "sipam.validateValues" -}}
{{- $messages := list -}}
{{- $messages := append $messages (include "sipam.validateValues.foo" .) -}}
{{- $messages := append $messages (include "sipam.validateValues.bar" .) -}}
{{- $messages := without $messages "" -}}
{{- $message := join "\n" $messages -}}

{{- if $message -}}
{{-   printf "\nVALUES VALIDATION:\n%s" $message -}}
{{- end -}}
{{- end -}}

