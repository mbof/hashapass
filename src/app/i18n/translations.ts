export type SupportedLocale = 'en' | 'fr' | 'de' | 'ja' | 'pt-BR';

export interface LocaleTranslations {
  name: string;
  subtitle: string;
  parameterLabel: string;
  parameterPlaceholder: string;
  parameterHelp: string;
  seedLabel: string;
  seedHelp: string;
  submitButton: string;
  copyButton: string;
  copiedButton: string;
  tagline: string;
  description: string;
  zippyWhyTitle: string;
  zippyWhyP1: string;
  zippyWhyP2: string;
  zippyWhyP3: string;
  zippyHowTitle: string;
  zippyHowP1: string;
  zippyHowP2: string;
  zippyHowP3: string;
  zippyHowP4: string;
  zippyWhereTitle: string;
  zippyWhereP1: string;
  zippyWhereP2: string;
  banner: string;
  footer: string;
}

export const TRANSLATIONS: Record<SupportedLocale, LocaleTranslations> = {
  en: {
    name: 'English',
    subtitle: 'password generator',
    parameterLabel: 'Parameter',
    parameterPlaceholder: 'e.g. google.com',
    parameterHelp: 'Something simple (“website”, “email”...)',
    seedLabel: 'Master password',
    seedHelp: 'Make this one hard—and be sure to remember it',
    submitButton: 'Hashapass!',
    copyButton: 'Copy',
    copiedButton: 'Copied!',
    tagline: 'A different password for every website and just one password to remember.',
    description:
      'Hashapass automatically generates strong passwords from a master password and a parameter.',
    zippyWhyTitle: 'Why use Hashapass?',
    zippyWhyP1: "If you're like most people, you reuse the same password in many different places.",
    zippyWhyP2:
      'Once attackers compromise one insecure website, they steal passwords and use them to log into other accounts. When they get into all your accounts, it gets ugly.',
    zippyWhyP3:
      'Hashapass lets you remember just one master password and use it to deterministically generate a different password for every website or service.',
    zippyHowTitle: 'How does it work?',
    zippyHowP1:
      'First, choose a "master password". Make it hard to guess. Be sure you remember it.',
    zippyHowP2:
      'To generate a password, enter a parameter, like the domain or service name. Hashapass computes the HMAC-SHA1 of your parameter with your master password and produces an 8-character string.',
    zippyHowP3: 'The passwords are never transmitted over the network or stored in any database.',
    zippyHowP4:
      'Given the same master password and parameter, Hashapass will always give you the exact same result.',
    zippyWhereTitle: 'Where are my passwords stored?',
    zippyWhereP1:
      "You don't store your generated passwords anywhere: just remember your master password and the parameter name.",
    zippyWhereP2:
      'Because the logic is fully client-side and deterministic, you can even save this page offline and generate your passwords without an internet connection.',
    banner:
      '⚠️ <strong>Hashapass is moving to GitHub Pages!</strong> Please update your bookmarks to {url}. The previous domain redirect will remain active until 2027.',
    footer: 'Hashapass · Deterministic Client-Side Password Generator · Hosted on {link}',
  },
  fr: {
    name: 'Français',
    subtitle: 'générateur de mot de passe',
    parameterLabel: 'Paramètre',
    parameterPlaceholder: 'ex. google.com',
    parameterHelp: 'Quelque chose de simple (« site », « messagerie »...)',
    seedLabel: 'Mot de passe maître',
    seedHelp: 'Choisissez-en un difficile — et assurez-vous de vous en souvenir',
    submitButton: 'Hashapass !',
    copyButton: 'Copier',
    copiedButton: 'Copié !',
    tagline: 'Un mot de passe différent pour chaque site web et un seul mot de passe à retenir.',
    description:
      'Hashapass génère automatiquement des mots de passe forts à partir d’un mot de passe maître et d’un paramètre.',
    zippyWhyTitle: 'Pourquoi utiliser Hashapass ?',
    zippyWhyP1:
      'Si vous êtes comme la plupart des gens, vous réutilisez le même mot de passe à différents endroits.',
    zippyWhyP2:
      'Lorsque des pirates s’introduisent sur un site non sécurisé, ils volent les mots de passe et s’en servent pour se connecter à vos autres comptes. Cela devient alors critique.',
    zippyWhyP3:
      'Hashapass vous permet de ne retenir qu’un seul mot de passe maître et de l’utiliser pour générer de manière déterministe un mot de passe unique pour chaque service.',
    zippyHowTitle: 'Comment ça marche ?',
    zippyHowP1:
      'Tout d’abord, choisissez un « mot de passe maître ». Rendez-le difficile à deviner et retenez-le bien.',
    zippyHowP2:
      'Pour générer un mot de passe, saisissez un paramètre (comme le nom du site ou du service). Hashapass calcule le hash HMAC-SHA1 et produit une chaîne de 8 caractères.',
    zippyHowP3:
      'Les mots de passe ne sont jamais transmis sur le réseau ni enregistrés dans aucune base de données.',
    zippyHowP4:
      'Avec le même mot de passe maître et le même paramètre, Hashapass vous donnera toujours exactement le même résultat.',
    zippyWhereTitle: 'Où sont stockés mes mots de passe ?',
    zippyWhereP1:
      'Vous n’avez pas besoin d’enregistrer vos mots de passe générés : retenez simplement votre mot de passe maître et le nom du paramètre.',
    zippyWhereP2:
      'Puisque le traitement s’exécute entièrement dans votre navigateur, vous pouvez même enregistrer cette page pour l’utiliser hors ligne.',
    banner:
      '⚠️ <strong>Hashapass déménage sur GitHub Pages !</strong> Veuillez mettre à jour vos favoris vers {url}. La redirection de l’ancien domaine restera active jusqu’en 2027.',
    footer: 'Hashapass · Générateur de mot de passe déterministe côté client · Hébergé sur {link}',
  },
  de: {
    name: 'Deutsch',
    subtitle: 'Passwortgenerator',
    parameterLabel: 'Parameter',
    parameterPlaceholder: 'z.B. google.com',
    parameterHelp: 'Etwas Einfaches („Webseite“, „E-Mail“...)',
    seedLabel: 'Master-Passwort',
    seedHelp: 'Wählen Sie ein schweres — und merken Sie es sich gut',
    submitButton: 'Hashapass!',
    copyButton: 'Kopieren',
    copiedButton: 'Kopiert!',
    tagline: 'Ein anderes Passwort für jede Webseite und nur ein einziges Passwort zum Merken.',
    description:
      'Hashapass generiert automatisch starke Passwörter aus einem Master-Passwort und einem Parameter.',
    zippyWhyTitle: 'Warum Hashapass verwenden?',
    zippyWhyP1:
      'Die meisten Menschen verwenden dasselbe Passwort an vielen verschiedenen Orten wieder.',
    zippyWhyP2:
      'Sobald Angreifer eine unsichere Webseite knacken, stehlen sie Passwörter und greifen auf andere Konten zu. Das kann verheerend sein.',
    zippyWhyP3:
      'Mit Hashapass merken Sie sich nur ein einziges Master-Passwort und generieren damit deterministisch ein eigenes Passwort für jede Webseite.',
    zippyHowTitle: 'Wie funktioniert es?',
    zippyHowP1:
      'Wählen Sie zuerst ein „Master-Passwort“. Machen Sie es schwer zu erraten und merken Sie es sich zuverlässig.',
    zippyHowP2:
      'Um ein Passwort zu erzeugen, geben Sie einen Parameter ein (z.B. den Namen der Webseite). Hashapass berechnet HMAC-SHA1 und liefert ein 8-stelliges Passwort.',
    zippyHowP3:
      'Die Passwörter werden niemals über das Netzwerk übertragen oder in einer Datenbank gespeichert.',
    zippyHowP4:
      'Bei gleichem Master-Passwort und Parameter erhalten Sie immer exakt dasselbe Passwort.',
    zippyWhereTitle: 'Wo werden meine Passwörter gespeichert?',
    zippyWhereP1:
      'Sie müssen die generierten Passwörter nirgendwo speichern: merken Sie sich einfach Ihr Master-Passwort und den Parameternamen.',
    zippyWhereP2:
      'Da die Berechnung vollständig im Browser erfolgt, können Sie diese Seite auch offline ohne Internetverbindung nutzen.',
    banner:
      '⚠️ <strong>Hashapass zieht auf GitHub Pages um!</strong> Bitte aktualisieren Sie Ihre Lesezeichen auf {url}. Die Weiterleitung der alten Domain bleibt bis 2027 aktiv.',
    footer: 'Hashapass · Deterministischer Client-seitiger Passwortgenerator · Gehostet auf {link}',
  },
  ja: {
    name: '日本語',
    subtitle: 'パスワード生成ツール',
    parameterLabel: 'パラメータ',
    parameterPlaceholder: '例: google.com',
    parameterHelp: '簡単なもの（「ウェブサイト」、「メール」など）',
    seedLabel: 'マスターパスワード',
    seedHelp: '推測されにくいものにして、必ず覚えておいてください',
    submitButton: 'Hashapass!',
    copyButton: 'コピー',
    copiedButton: 'コピー完了！',
    tagline: 'すべてのウェブサイトに異なるパスワードを、覚えるパスワードは1つだけ。',
    description: 'Hashapassはマスターパスワードとパラメータから強力なパスワードを自動生成します。',
    zippyWhyTitle: 'なぜHashapassを使うのか？',
    zippyWhyP1: '多くの人は、さまざまな場所で同じパスワードを使い回しています。',
    zippyWhyP2:
      'ハッカーがどこか1つのサイトを不正侵入すると、そのパスワードを使って他のアカウントにも侵入されてしまいます。',
    zippyWhyP3:
      'Hashapassを使えば、1つのマスターパスワードを覚えるだけで、サイトごとに異なるパスワードを確実に再現生成できます。',
    zippyHowTitle: 'どのような仕組みですか？',
    zippyHowP1: 'まず、推測されにくい「マスターパスワード」を1つ決めて、しっかりと覚えてください。',
    zippyHowP2:
      'パスワードを生成するには、サイト名などのパラメータを入力します。HashapassはHMAC-SHA1を計算し、8文字のパスワードを出力します。',
    zippyHowP3:
      '入力したパスワードはネットワークを介して送信されたり、サーバーに保存されたりすることは一切ありません。',
    zippyHowP4:
      '同じマスターパスワードとパラメータを入力すれば、常に全く同じパスワードが生成されます。',
    zippyWhereTitle: 'パスワードはどこに保存されますか？',
    zippyWhereP1:
      '生成されたパスワードをどこかに保存しておく必要はありません。マスターパスワードとパラメータ名だけを覚えておくだけです。',
    zippyWhereP2:
      'すべての処理はブラウザ内で完結するため、このページを保存してオフラインで利用することも可能です。',
    banner:
      '⚠️ <strong>HashapassはGitHub Pagesに移行します！</strong> ブックマークを {url} に更新してください。旧ドメインからのリダイレクトは2027年まで継続します。',
    footer: 'Hashapass · 決定論的クライアントサイド・パスワード生成ツール · {link}でホスト中',
  },
  'pt-BR': {
    name: 'Português',
    subtitle: 'gerador de senhas',
    parameterLabel: 'Parâmetro',
    parameterPlaceholder: 'ex. google.com',
    parameterHelp: 'Algo simples (“site”, “email”...)',
    seedLabel: 'Senha mestra',
    seedHelp: 'Crie uma senha difícil — e não se esqueça dela',
    submitButton: 'Hashapass!',
    copyButton: 'Copiar',
    copiedButton: 'Copiado!',
    tagline: 'Uma senha diferente para cada site e apenas uma senha para lembrar.',
    description:
      'O Hashapass gera senhas fortes automaticamente a partir de uma senha mestra e de um parâmetro.',
    zippyWhyTitle: 'Por que usar o Hashapass?',
    zippyWhyP1:
      'Se você for como a maioria das pessoas, reutiliza a mesma senha em vários lugares diferentes.',
    zippyWhyP2:
      'Assim que invasores comprometem um site vulnerável, eles roubam senhas e as utilizam para acessar suas outras contas. Quando conseguem entrar em tudo, as coisas complicam.',
    zippyWhyP3:
      'O Hashapass permite que você memorize apenas uma senha mestra e a utilize para gerar de forma determinística uma senha diferente para cada site ou serviço.',
    zippyHowTitle: 'Como funciona?',
    zippyHowP1:
      'Primeiro, escolha uma "senha mestra". Crie uma difícil de adivinhar e memorize-a bem.',
    zippyHowP2:
      'Para gerar uma senha, digite um parâmetro, como o nome do domínio ou do serviço. O Hashapass calcula o HMAC-SHA1 do seu parâmetro com a sua senha mestra e produz uma sequência de 8 caracteres.',
    zippyHowP3:
      'As senhas nunca são transmitidas pela rede nem armazenadas em nenhum banco de dados.',
    zippyHowP4:
      'Com a mesma senha mestra e o mesmo parâmetro, o Hashapass sempre fornecerá exatamente o mesmo resultado.',
    zippyWhereTitle: 'Onde minhas senhas ficam armazenadas?',
    zippyWhereP1:
      'Você não precisa armazenar suas senhas geradas em lugar nenhum: basta lembrar da sua senha mestra e do parâmetro.',
    zippyWhereP2:
      'Como o processamento é totalmente determinístico e executado no navegador, você pode até salvar esta página para gerar senhas offline, sem conexão com a internet.',
    banner:
      '⚠️ <strong>O Hashapass está mudando para o GitHub Pages!</strong> Atualize seus favoritos para {url}. O redirecionamento do domínio anterior continuará ativo até 2027.',
    footer: 'Hashapass · Gerador determinístico de senhas no navegador · Hospedado no {link}',
  },
};
