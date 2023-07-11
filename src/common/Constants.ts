
const Channels = {
  Ping: 'Ping',
  Shell: {
    Create: 'Create',
    Resize: 'Resize',
    Write: 'Write',
    Destory: 'Destory',
    OnProcessExit: (sid: string) => 'OnProcessExit/' + sid,
    OnClose: (sid: string) => 'OnClose/' + sid,
  },
  OnKeyPressed: 'OnKeyPressed'
}

const Accelerators = {
  SwitchPanel: 'Command+`',
  ClosePanel: 'Command+W',
}

export { Channels, Accelerators };
