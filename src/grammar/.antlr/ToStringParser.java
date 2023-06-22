// Generated from /Users/I507145/Workspace/LKS/core/src/grammar/ToString.g4 by ANTLR 4.9.2
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.misc.*;
import org.antlr.v4.runtime.tree.*;
import java.util.List;
import java.util.Iterator;
import java.util.ArrayList;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast"})
public class ToStringParser extends Parser {
	static { RuntimeMetaData.checkVersion("4.9.2", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		T__0=1, T__1=2, T__2=3, T__3=4, T__4=5, T__5=6, T__6=7, T__7=8, LITERAL_VALUE=9, 
		WS=10;
	public static final int
		RULE_data = 0, RULE_map = 1, RULE_mapPair = 2, RULE_arr = 3, RULE_obj = 4, 
		RULE_objPair = 5, RULE_identifier = 6, RULE_value = 7;
	private static String[] makeRuleNames() {
		return new String[] {
			"data", "map", "mapPair", "arr", "obj", "objPair", "identifier", "value"
		};
	}
	public static final String[] ruleNames = makeRuleNames();

	private static String[] makeLiteralNames() {
		return new String[] {
			null, "'{'", "','", "'}'", "'='", "'['", "']'", "'('", "')'"
		};
	}
	private static final String[] _LITERAL_NAMES = makeLiteralNames();
	private static String[] makeSymbolicNames() {
		return new String[] {
			null, null, null, null, null, null, null, null, null, "LITERAL_VALUE", 
			"WS"
		};
	}
	private static final String[] _SYMBOLIC_NAMES = makeSymbolicNames();
	public static final Vocabulary VOCABULARY = new VocabularyImpl(_LITERAL_NAMES, _SYMBOLIC_NAMES);

	/**
	 * @deprecated Use {@link #VOCABULARY} instead.
	 */
	@Deprecated
	public static final String[] tokenNames;
	static {
		tokenNames = new String[_SYMBOLIC_NAMES.length];
		for (int i = 0; i < tokenNames.length; i++) {
			tokenNames[i] = VOCABULARY.getLiteralName(i);
			if (tokenNames[i] == null) {
				tokenNames[i] = VOCABULARY.getSymbolicName(i);
			}

			if (tokenNames[i] == null) {
				tokenNames[i] = "<INVALID>";
			}
		}
	}

	@Override
	@Deprecated
	public String[] getTokenNames() {
		return tokenNames;
	}

	@Override

	public Vocabulary getVocabulary() {
		return VOCABULARY;
	}

	@Override
	public String getGrammarFileName() { return "ToString.g4"; }

	@Override
	public String[] getRuleNames() { return ruleNames; }

	@Override
	public String getSerializedATN() { return _serializedATN; }

	@Override
	public ATN getATN() { return _ATN; }

	public ToStringParser(TokenStream input) {
		super(input);
		_interp = new ParserATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}

	public static class DataContext extends ParserRuleContext {
		public MapContext map() {
			return getRuleContext(MapContext.class,0);
		}
		public ArrContext arr() {
			return getRuleContext(ArrContext.class,0);
		}
		public ObjContext obj() {
			return getRuleContext(ObjContext.class,0);
		}
		public DataContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_data; }
	}

	public final DataContext data() throws RecognitionException {
		DataContext _localctx = new DataContext(_ctx, getState());
		enterRule(_localctx, 0, RULE_data);
		try {
			setState(19);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case T__0:
				enterOuterAlt(_localctx, 1);
				{
				setState(16);
				map();
				}
				break;
			case T__4:
				enterOuterAlt(_localctx, 2);
				{
				setState(17);
				arr();
				}
				break;
			case LITERAL_VALUE:
				enterOuterAlt(_localctx, 3);
				{
				setState(18);
				obj();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class MapContext extends ParserRuleContext {
		public List<MapPairContext> mapPair() {
			return getRuleContexts(MapPairContext.class);
		}
		public MapPairContext mapPair(int i) {
			return getRuleContext(MapPairContext.class,i);
		}
		public MapContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_map; }
	}

	public final MapContext map() throws RecognitionException {
		MapContext _localctx = new MapContext(_ctx, getState());
		enterRule(_localctx, 2, RULE_map);
		int _la;
		try {
			setState(34);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,2,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(21);
				match(T__0);
				setState(22);
				mapPair();
				setState(27);
				_errHandler.sync(this);
				_la = _input.LA(1);
				while (_la==T__1) {
					{
					{
					setState(23);
					match(T__1);
					setState(24);
					mapPair();
					}
					}
					setState(29);
					_errHandler.sync(this);
					_la = _input.LA(1);
				}
				setState(30);
				match(T__2);
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(32);
				match(T__0);
				setState(33);
				match(T__2);
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class MapPairContext extends ParserRuleContext {
		public List<ValueContext> value() {
			return getRuleContexts(ValueContext.class);
		}
		public ValueContext value(int i) {
			return getRuleContext(ValueContext.class,i);
		}
		public MapPairContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_mapPair; }
	}

	public final MapPairContext mapPair() throws RecognitionException {
		MapPairContext _localctx = new MapPairContext(_ctx, getState());
		enterRule(_localctx, 4, RULE_mapPair);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(36);
			value();
			setState(37);
			match(T__3);
			setState(39);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << T__0) | (1L << T__4) | (1L << LITERAL_VALUE))) != 0)) {
				{
				setState(38);
				value();
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ArrContext extends ParserRuleContext {
		public List<ValueContext> value() {
			return getRuleContexts(ValueContext.class);
		}
		public ValueContext value(int i) {
			return getRuleContext(ValueContext.class,i);
		}
		public ArrContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_arr; }
	}

	public final ArrContext arr() throws RecognitionException {
		ArrContext _localctx = new ArrContext(_ctx, getState());
		enterRule(_localctx, 6, RULE_arr);
		int _la;
		try {
			setState(54);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,5,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(41);
				match(T__4);
				setState(42);
				value();
				setState(47);
				_errHandler.sync(this);
				_la = _input.LA(1);
				while (_la==T__1) {
					{
					{
					setState(43);
					match(T__1);
					setState(44);
					value();
					}
					}
					setState(49);
					_errHandler.sync(this);
					_la = _input.LA(1);
				}
				setState(50);
				match(T__5);
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(52);
				match(T__4);
				setState(53);
				match(T__5);
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ObjContext extends ParserRuleContext {
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
		public List<ObjPairContext> objPair() {
			return getRuleContexts(ObjPairContext.class);
		}
		public ObjPairContext objPair(int i) {
			return getRuleContext(ObjPairContext.class,i);
		}
		public ObjContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_obj; }
	}

	public final ObjContext obj() throws RecognitionException {
		ObjContext _localctx = new ObjContext(_ctx, getState());
		enterRule(_localctx, 8, RULE_obj);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(56);
			identifier();
			setState(57);
			match(T__6);
			setState(66);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==LITERAL_VALUE) {
				{
				setState(58);
				objPair();
				setState(63);
				_errHandler.sync(this);
				_la = _input.LA(1);
				while (_la==T__1) {
					{
					{
					setState(59);
					match(T__1);
					setState(60);
					objPair();
					}
					}
					setState(65);
					_errHandler.sync(this);
					_la = _input.LA(1);
				}
				}
			}

			setState(68);
			match(T__7);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ObjPairContext extends ParserRuleContext {
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
		public ValueContext value() {
			return getRuleContext(ValueContext.class,0);
		}
		public ObjPairContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_objPair; }
	}

	public final ObjPairContext objPair() throws RecognitionException {
		ObjPairContext _localctx = new ObjPairContext(_ctx, getState());
		enterRule(_localctx, 10, RULE_objPair);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(70);
			identifier();
			setState(71);
			match(T__3);
			setState(73);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << T__0) | (1L << T__4) | (1L << LITERAL_VALUE))) != 0)) {
				{
				setState(72);
				value();
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class IdentifierContext extends ParserRuleContext {
		public TerminalNode LITERAL_VALUE() { return getToken(ToStringParser.LITERAL_VALUE, 0); }
		public IdentifierContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_identifier; }
	}

	public final IdentifierContext identifier() throws RecognitionException {
		IdentifierContext _localctx = new IdentifierContext(_ctx, getState());
		enterRule(_localctx, 12, RULE_identifier);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(75);
			match(LITERAL_VALUE);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ValueContext extends ParserRuleContext {
		public DataContext data() {
			return getRuleContext(DataContext.class,0);
		}
		public TerminalNode LITERAL_VALUE() { return getToken(ToStringParser.LITERAL_VALUE, 0); }
		public ValueContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_value; }
	}

	public final ValueContext value() throws RecognitionException {
		ValueContext _localctx = new ValueContext(_ctx, getState());
		enterRule(_localctx, 14, RULE_value);
		try {
			setState(79);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,9,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(77);
				data();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(78);
				match(LITERAL_VALUE);
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static final String _serializedATN =
		"\3\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964\3\fT\4\2\t\2\4\3\t"+
		"\3\4\4\t\4\4\5\t\5\4\6\t\6\4\7\t\7\4\b\t\b\4\t\t\t\3\2\3\2\3\2\5\2\26"+
		"\n\2\3\3\3\3\3\3\3\3\7\3\34\n\3\f\3\16\3\37\13\3\3\3\3\3\3\3\3\3\5\3%"+
		"\n\3\3\4\3\4\3\4\5\4*\n\4\3\5\3\5\3\5\3\5\7\5\60\n\5\f\5\16\5\63\13\5"+
		"\3\5\3\5\3\5\3\5\5\59\n\5\3\6\3\6\3\6\3\6\3\6\7\6@\n\6\f\6\16\6C\13\6"+
		"\5\6E\n\6\3\6\3\6\3\7\3\7\3\7\5\7L\n\7\3\b\3\b\3\t\3\t\5\tR\n\t\3\t\2"+
		"\2\n\2\4\6\b\n\f\16\20\2\2\2V\2\25\3\2\2\2\4$\3\2\2\2\6&\3\2\2\2\b8\3"+
		"\2\2\2\n:\3\2\2\2\fH\3\2\2\2\16M\3\2\2\2\20Q\3\2\2\2\22\26\5\4\3\2\23"+
		"\26\5\b\5\2\24\26\5\n\6\2\25\22\3\2\2\2\25\23\3\2\2\2\25\24\3\2\2\2\26"+
		"\3\3\2\2\2\27\30\7\3\2\2\30\35\5\6\4\2\31\32\7\4\2\2\32\34\5\6\4\2\33"+
		"\31\3\2\2\2\34\37\3\2\2\2\35\33\3\2\2\2\35\36\3\2\2\2\36 \3\2\2\2\37\35"+
		"\3\2\2\2 !\7\5\2\2!%\3\2\2\2\"#\7\3\2\2#%\7\5\2\2$\27\3\2\2\2$\"\3\2\2"+
		"\2%\5\3\2\2\2&\'\5\20\t\2\')\7\6\2\2(*\5\20\t\2)(\3\2\2\2)*\3\2\2\2*\7"+
		"\3\2\2\2+,\7\7\2\2,\61\5\20\t\2-.\7\4\2\2.\60\5\20\t\2/-\3\2\2\2\60\63"+
		"\3\2\2\2\61/\3\2\2\2\61\62\3\2\2\2\62\64\3\2\2\2\63\61\3\2\2\2\64\65\7"+
		"\b\2\2\659\3\2\2\2\66\67\7\7\2\2\679\7\b\2\28+\3\2\2\28\66\3\2\2\29\t"+
		"\3\2\2\2:;\5\16\b\2;D\7\t\2\2<A\5\f\7\2=>\7\4\2\2>@\5\f\7\2?=\3\2\2\2"+
		"@C\3\2\2\2A?\3\2\2\2AB\3\2\2\2BE\3\2\2\2CA\3\2\2\2D<\3\2\2\2DE\3\2\2\2"+
		"EF\3\2\2\2FG\7\n\2\2G\13\3\2\2\2HI\5\16\b\2IK\7\6\2\2JL\5\20\t\2KJ\3\2"+
		"\2\2KL\3\2\2\2L\r\3\2\2\2MN\7\13\2\2N\17\3\2\2\2OR\5\2\2\2PR\7\13\2\2"+
		"QO\3\2\2\2QP\3\2\2\2R\21\3\2\2\2\f\25\35$)\618ADKQ";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}